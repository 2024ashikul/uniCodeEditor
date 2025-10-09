"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const file_repository_1 = require("../repositories/file.repository");
const archiver_1 = __importDefault(require("archiver"));
class FileService {
    constructor() {
        this.fileRepo = new file_repository_1.FileRepository();
    }
    createZipStreamForPath(folderPath) {
        if (!this.fileRepo.pathExists(folderPath)) {
            return null;
        }
        const archive = (0, archiver_1.default)("zip", { zlib: { level: 9 } });
        archive.directory(folderPath, false);
        return archive;
    }
}
exports.FileService = FileService;
