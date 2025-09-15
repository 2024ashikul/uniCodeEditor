const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Reusable Multer Configuration ---

// 1. Define the storage engine for temporary project zip files
const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // All temporary uploads will go into this single directory
        const tempPath = path.join(__dirname, '..', 'uploads', 'temp');
        fs.mkdirSync(tempPath, { recursive: true }); // Ensure the directory exists
        cb(null, tempPath);
    },
    filename: (req, file, cb) => {
        // Create a unique filename to prevent conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Create the configured multer instance
// This instance is specifically for handling a single file upload with the field name 'projectZip'
const uploadProjectZip = multer({
    storage: projectStorage,
    limits: {
        fileSize: 1024 * 1024 * 50 // Optional: Set a file size limit (e.g., 50MB)
    },
    fileFilter: (req, file, cb) => {
        // Optional: Ensure only .zip files are accepted
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
            cb(null, true);
        } else {
            cb(new Error('Only .zip files are allowed!'), false);
        }
    }
}).single('projectZip'); // This expects a single file with the field name 'projectZip'

// 3. Export the configured middleware


const uploadProfilePhoto = multer({
    storage: projectStorage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Optional: Set a file size limit (e.g., 50MB)
    },
    fileFilter: (req, file, cb) => {
        // Optional: Ensure only .zip files are accepted
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            // FIX 2: Corrected the error message
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('profilePhoto'); // This expects a single file with the field name 'projectZip'

// 3. Export the configured middleware
module.exports = {
    uploadProjectZip,
     uploadProfilePhoto
};