"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const file_service_1 = require("../services/file.service");
const file_repository_1 = require("../repositories/file.repository");
class FileController {
    constructor() {
        this.downloadSubmission = async (req, res) => {
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
            }
            catch (err) {
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error creating zip file', error: err.message });
                }
            }
        };
        this.downloadMaterial = async (req, res) => {
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
            }
            catch (err) {
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error creating zip file', error: err.message });
                }
            }
        };
        this.service = new file_service_1.FileService();
        this.fileRepo = new file_repository_1.FileRepository();
    }
}
exports.FileController = FileController;
