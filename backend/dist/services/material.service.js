"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialService = void 0;
const material_repository_1 = require("../repositories/material.repository");
const path_1 = __importDefault(require("path"));
const models_1 = require("../models");
class MaterialService {
    constructor() {
        this.materialRepo = new material_repository_1.MaterialRepository();
    }
    async uploadMaterial(file, roomId, userId, type) {
        const tempFilePath = file.path;
        const originalFilename = file.originalname;
        const extension = path_1.default.extname(originalFilename);
        const baseName = path_1.default.basename(originalFilename, extension);
        let finalFilename = originalFilename;
        let counter = 1;
        while (await this.materialRepo.findByName(finalFilename, roomId, type)) {
            finalFilename = `${baseName}(${counter})${extension}`;
            counter++;
        }
        const destinationFolder = path_1.default.join(process.cwd(), 'uploads', 'materials', roomId);
        await this.materialRepo.saveFile(tempFilePath, destinationFolder, finalFilename);
        const newMaterial = await this.materialRepo.create({
            filename: finalFilename,
            file_extension: extension,
            type: type,
            userId: userId,
            roomId: roomId,
        });
        if (type === 'folder') {
            await models_1.db.Announcement.create({
                title: `New material ${baseName} uploaded`,
                description: '',
                category: 'Material',
                attachment: newMaterial.filename,
                roomId: roomId,
                userId: userId
            });
        }
        return newMaterial;
    }
    async deleteMaterial(materialId, roomId) {
        const material = await this.materialRepo.findById(materialId);
        if (!material) {
            throw new Error('Material not found');
        }
        const filePath = path_1.default.join(process.cwd(), "uploads", "materials", roomId, material.filename);
        await this.materialRepo.deleteFile(filePath);
        await this.materialRepo.deleteById(materialId);
    }
    async getMaterialsForRoom(roomId) {
        return this.materialRepo.findAllByRoomId(roomId);
    }
}
exports.MaterialService = MaterialService;
