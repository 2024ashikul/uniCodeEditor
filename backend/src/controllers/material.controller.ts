import { Request, Response } from 'express';
import { MaterialService } from '../services/material.service';

export class MaterialController {
  private service: MaterialService;

  constructor() {
    this.service = new MaterialService();
  }

  uploadFile = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file was uploaded." });
      }
      const { roomId } = req.body;
      const userId = (req as any).user.userId;

      const newMaterial = await this.service.uploadMaterial(req.file, roomId, userId, 'file');

      return res.status(200).json({ message: 'File uploaded successfully!', newMaterial });
    } catch (err: any) {
      // Basic error handling; a real app might have a dedicated error middleware
      console.error("Upload failed:", err);
      return res.status(500).json({ message: err.message || 'Failed to process the uploaded file.' });
    }
  };

  uploadFolder = async (req: Request, res: Response): Promise<Response> => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No folder (zip) was uploaded." });
      }
      const { roomId } = req.body;
      const userId = (req as any).user.userId;

      const newMaterial = await this.service.uploadMaterial(req.file, roomId, userId, 'folder');

      return res.status(200).json({ message: 'Folder uploaded successfully!', newMaterial });
    } catch (err: any) {
      console.error("Upload failed:", err);
      return res.status(500).json({ message: err.message || 'Failed to process the uploaded folder.' });
    }
  };

  fetchall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId } = req.body;
      const materials = await this.service.getMaterialsForRoom(roomId);
      return res.status(200).json(materials);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { materialId, roomId } = req.body;
      await this.service.deleteMaterial(materialId, roomId);
      return res.status(200).json({ message: 'Material deleted successfully' });
    } catch (err: any) {
        if(err.message === 'Material not found') {
            return res.status(404).json({ message: err.message });
        }
      return res.status(500).json({ message: err.message });
    }
  };
}