import { Request, Response } from 'express';
import { FileService } from '../services/file.service';
import { FileRepository } from '../repositories/file.repository'; 

export class FileController {
  private service: FileService;
  private fileRepo: FileRepository; 

  constructor() {
    this.service = new FileService();
    this.fileRepo = new FileRepository();
  }

  downloadSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const { folder } = req.params;
      const folderPath = this.fileRepo.getSubmissionFolderPath(folder);
      
      const archive = this.service.createZipStreamForPath(folderPath);

      if (!archive) {
        res.status(404).json({ message: "Submission folder not found" });
        return;
      }

      // Set headers to trigger a browser download
      res.setHeader("Content-Disposition", `attachment; filename=${folder}.zip`);
      res.setHeader("Content-Type", "application/zip");

     
      archive.on("error", (err) => {
        console.error("Archive error:", err);
        throw err; 
      });

    
      archive.pipe(res);
      await archive.finalize();

    } catch (err: any) {
    
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error creating zip file', error: err.message });
      }
    }
  };

  downloadMaterial = async (req: Request, res: Response): Promise<void> => {
   
    try {
      const { folder } = req.params;
      const folderPath = this.fileRepo.getMaterialFolderPath(folder);
      
      const archive = this.service.createZipStreamForPath(folderPath);

      if (!archive) {
        res.status(404).json({ message: "Material folder not found" });
        return;
      }
      
      res.setHeader("Content-Disposition", `attachment; filename=${folder}.zip`);
      res.setHeader("Content-Type", "application/zip");
      archive.on("error", (err) => { throw err; });
      
      archive.pipe(res);
      await archive.finalize();

    } catch (err: any) {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error creating zip file', error: err.message });
      }
    }
  };
}