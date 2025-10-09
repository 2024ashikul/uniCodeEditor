"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialRepository = void 0;
const models_1 = require("../models"); // Your clean, refactored db object
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class MaterialRepository {
    async create(data) {
        return models_1.db.Material.create(data);
    }
    async findById(id) {
        return models_1.db.Material.findByPk(id);
    }
    async findByName(filename, roomId, type) {
        return models_1.db.Material.findOne({ where: { filename, roomId, type } });
    }
    async findAllByRoomId(roomId) {
        return models_1.db.Material.findAll({ where: { roomId } });
    }
    async deleteById(id) {
        return models_1.db.Material.destroy({ where: { id } });
    }
    async saveFile(tempPath, finalDirectory, finalFilename) {
        await promises_1.default.mkdir(finalDirectory, { recursive: true });
        const finalPath = path_1.default.join(finalDirectory, finalFilename);
        await promises_1.default.rename(tempPath, finalPath);
        return finalPath;
    }
    async deleteFile(filePath) {
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
}
exports.MaterialRepository = MaterialRepository;
