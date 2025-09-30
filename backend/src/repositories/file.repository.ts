import fs from 'fs';
import path from 'path';

export class FileRepository {
 
  pathExists(fullPath: string): boolean {
    return fs.existsSync(fullPath);
  }

  
  getSubmissionFolderPath(folder: string): string {
    return path.join(process.cwd(), "uploads", "submissions", folder);
  }

 
  getMaterialFolderPath(folder: string): string {
    return path.join(process.cwd(), "uploads", "materials", folder);
  }
}