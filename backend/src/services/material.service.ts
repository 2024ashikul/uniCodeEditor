import { MaterialRepository } from '../repositories/material.repository';
import { Material } from '../models/material.model';
import path from 'path';
import { db } from '../models';

interface UploadedFile {
  originalname: string;
  path: string; 
}

export class MaterialService {
  private materialRepo: MaterialRepository;

  constructor() {
    this.materialRepo = new MaterialRepository();
  }

  
  async uploadMaterial(file: UploadedFile, roomId: string, userId: string, type: 'file' | 'folder'): Promise<Material> {
    const tempFilePath = file.path;
    const originalFilename = file.originalname;
    const extension = path.extname(originalFilename);
    const baseName = path.basename(originalFilename, extension);

   
    let finalFilename = originalFilename;
    let counter = 1;
    while (await this.materialRepo.findByName(finalFilename, roomId, type)) {
      finalFilename = `${baseName}(${counter})${extension}`;
      counter++;
    }

   
    const destinationFolder = path.join(process.cwd(), 'uploads', 'materials', roomId);
    await this.materialRepo.saveFile(tempFilePath, destinationFolder, finalFilename);

   
    const newMaterial = await this.materialRepo.create({
      filename: finalFilename,
      file_extension: extension,
      type: type,
      userId: userId,
      roomId: roomId,
    });

    
    if (type === 'folder') {
       
        await db.Announcement.create({
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

  async deleteMaterial(materialId: number, roomId: string): Promise<void> {
    const material = await this.materialRepo.findById(materialId);
    if (!material) {
      throw new Error('Material not found');
    }

    
    const filePath = path.join(process.cwd(), "uploads", "materials", roomId, material.filename);
    await this.materialRepo.deleteFile(filePath);
    await this.materialRepo.deleteById(materialId);
  }

  async getMaterialsForRoom(roomId: string): Promise<Material[]> {
    return this.materialRepo.findAllByRoomId(roomId);
  }
}