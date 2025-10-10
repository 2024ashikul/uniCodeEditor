import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Define a type for the callback function in the file filter to ensure type safety.
type Mimetypes = 'application/zip' | 'application/x-zip-compressed' | 'image/';


const createFileFilter = (allowedMimetypes: Mimetypes[], errorMessage: string) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const isAllowed = allowedMimetypes.some(type => file.mimetype.startsWith(type));
        if (isAllowed) {
            cb(null, true);
        } else {
            // Reject the file with a specific error message.
            cb(new Error(errorMessage));
        }
    };
};


const projectStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        // All uploads will temporarily go to the 'uploads/temp' directory.
        const tempPath = path.join(__dirname, '..', '..', 'uploads', 'temp');
        // Ensure the directory exists.
        fs.mkdirSync(tempPath, { recursive: true });
        cb(null, tempPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        // Create a unique filename to prevent overwrites.
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// --- Multer Instances ---

// Middleware for uploading a single project zip file ('projectZip').
export const uploadProjectZip = multer({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB limit
    fileFilter: createFileFilter(
        ['application/zip', 'application/x-zip-compressed'],
        'Only .zip files are allowed!'
    ),
}).single('projectZip');

// Middleware for uploading a single profile photo ('profilePhoto').
export const uploadProfilePhoto = multer({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: createFileFilter(
        ['image/'],
        'Only image files (JPEG, PNG, GIF, etc.) are allowed!'
    ),
}).single('profilePhoto');

// Middleware for uploading multiple material files as a zip ('files').
export const uploadMaterialZip = multer({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB limit
}).single('files'); // Allows any file type for this specific uploader

// Middleware for uploading a single material file ('file').
export const uploadMaterialFile = multer({
    storage: projectStorage,
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB limit
}).single('file'); // Allows any file type
