"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialController = void 0;
const material_service_1 = require("../services/material.service");
class MaterialController {
    constructor() {
        this.uploadFile = async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ message: "No file was uploaded." });
                }
                const { roomId } = req.body;
                const userId = req.user.userId;
                const newMaterial = await this.service.uploadMaterial(req.file, roomId, userId, 'file');
                return res.status(200).json({ message: 'File uploaded successfully!', newMaterial });
            }
            catch (err) {
                // Basic error handling; a real app might have a dedicated error middleware
                console.error("Upload failed:", err);
                return res.status(500).json({ message: err.message || 'Failed to process the uploaded file.' });
            }
        };
        this.uploadFolder = async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ message: "No folder (zip) was uploaded." });
                }
                const { roomId } = req.body;
                const userId = req.user.userId;
                const newMaterial = await this.service.uploadMaterial(req.file, roomId, userId, 'folder');
                return res.status(200).json({ message: 'Folder uploaded successfully!', newMaterial });
            }
            catch (err) {
                console.error("Upload failed:", err);
                return res.status(500).json({ message: err.message || 'Failed to process the uploaded folder.' });
            }
        };
        this.fetchall = async (req, res) => {
            try {
                const { roomId } = req.body;
                const materials = await this.service.getMaterialsForRoom(roomId);
                return res.status(200).json(materials);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { materialId, roomId } = req.body;
                await this.service.deleteMaterial(materialId, roomId);
                return res.status(200).json({ message: 'Material deleted successfully' });
            }
            catch (err) {
                if (err.message === 'Material not found') {
                    return res.status(404).json({ message: err.message });
                }
                return res.status(500).json({ message: err.message });
            }
        };
        this.service = new material_service_1.MaterialService();
    }
}
exports.MaterialController = MaterialController;
