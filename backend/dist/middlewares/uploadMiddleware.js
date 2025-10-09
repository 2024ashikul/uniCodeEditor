"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMaterialFile = exports.uploadMaterialZip = exports.uploadProfilePhoto = exports.uploadProjectZip = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createFileFilter = (allowedMimetypes, errorMessage) => {
    return (req, file, cb) => {
        const isAllowed = allowedMimetypes.some(type => file.mimetype.startsWith(type));
        if (isAllowed) {
            cb(null, true);
        }
        else {
            // Reject the file with a specific error message.
            cb(new Error(errorMessage));
        }
    };
};
const projectStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // All uploads will temporarily go to the 'uploads/temp' directory.
        const tempPath = path_1.default.join(__dirname, '..', '..', 'uploads', 'temp');
        // Ensure the directory exists.
        fs_1.default.mkdirSync(tempPath, { recursive: true });
        cb(null, tempPath);
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent overwrites.
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
// --- Multer Instances ---
// Middleware for uploading a single project zip file ('projectZip').
exports.uploadProjectZip = (0, multer_1.default)({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB limit
    fileFilter: createFileFilter(['application/zip', 'application/x-zip-compressed'], 'Only .zip files are allowed!'),
}).single('projectZip');
// Middleware for uploading a single profile photo ('profilePhoto').
exports.uploadProfilePhoto = (0, multer_1.default)({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: createFileFilter(['image/'], 'Only image files (JPEG, PNG, GIF, etc.) are allowed!'),
}).single('profilePhoto');
// Middleware for uploading multiple material files as a zip ('files').
exports.uploadMaterialZip = (0, multer_1.default)({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB limit
}).single('files'); // Allows any file type for this specific uploader
// Middleware for uploading a single material file ('file').
exports.uploadMaterialFile = (0, multer_1.default)({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB limit
}).single('file'); // Allows any file type
