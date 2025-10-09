"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileRepository {
    pathExists(fullPath) {
        return fs_1.default.existsSync(fullPath);
    }
    getSubmissionFolderPath(folder) {
        return path_1.default.join(process.cwd(), "uploads", "submissions", folder);
    }
    getMaterialFolderPath(folder) {
        return path_1.default.join(process.cwd(), "uploads", "materials", folder);
    }
}
exports.FileRepository = FileRepository;
