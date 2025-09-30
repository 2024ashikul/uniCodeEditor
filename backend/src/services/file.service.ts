import { FileRepository } from '../repositories/file.repository';
import archiver from 'archiver';

export class FileService {
  private fileRepo: FileRepository;

  constructor() {
    this.fileRepo = new FileRepository();
  }

  
  createZipStreamForPath(folderPath: string): archiver.Archiver | null {
    if (!this.fileRepo.pathExists(folderPath)) {
      return null;
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.directory(folderPath, false); 

    return archive;
  }
}