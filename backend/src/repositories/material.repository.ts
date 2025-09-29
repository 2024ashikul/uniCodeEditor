import { db } from '../models'; // Your clean, refactored db object
import { Material } from '../models/material.model';
import fs from 'fs/promises';
import path from 'path';

export class MaterialRepository {
  async create(data: {
    filename: string;
    file_extension: string;
    type: 'folder' | 'file';
    userId: string;
    roomId: string;
  }): Promise<Material> {
    return db.Material.create(data);
  }

  async findById(id: number): Promise<Material | null> {
    return db.Material.findByPk(id);
  }

  async findByName(filename: string, roomId: string, type: 'folder' | 'file'): Promise<Material | null> {
    return db.Material.findOne({ where: { filename, roomId, type } });
  }

  async findAllByRoomId(roomId: string): Promise<Material[]> {
    return db.Material.findAll({ where: { roomId } });
  }

  async deleteById(id: number): Promise<number> {
    return db.Material.destroy({ where: { id } });
  }

  

  async saveFile(tempPath: string, finalDirectory: string, finalFilename: string): Promise<string> {
    await fs.mkdir(finalDirectory, { recursive: true });
    const finalPath = path.join(finalDirectory, finalFilename);
    await fs.rename(tempPath, finalPath);
    return finalPath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}