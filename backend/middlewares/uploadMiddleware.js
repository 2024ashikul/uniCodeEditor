const multer = require('multer');
const path = require('path');
const fs = require('fs');

const projectStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        const tempPath = path.join(__dirname, '..', 'uploads', 'temp');
        fs.mkdirSync(tempPath, { recursive: true }); 
        cb(null, tempPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadProjectZip = multer({
    storage: projectStorage,
    limits: {
        fileSize: 1024 * 1024 * 50 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
            cb(null, true);
        } else {
            cb(new Error('Only .zip files are allowed!'), false);
        }
    }
}).single('projectZip');




const uploadProfilePhoto = multer({
    storage: projectStorage,
    limits: {
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: (req, file, cb) => {

        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
           
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).single('profilePhoto');


const uploadMaterialZip = multer({
    storage: projectStorage,
    limits: {
        fileSize: 1024 * 1024 * 50 
    },
    fileFilter: (req, file, cb) => {
        
        if (file) {
            cb(null, true);
        } else {
            cb(new Error('Only .zip files are allowed!'), false);
        }
    }
}).single('files');



const uploadMaterialFile = multer({
    storage: projectStorage,
    limits: {
        fileSize: 1024 * 1024 * 50 
    },
    fileFilter: (req, file, cb) => {
        
        if (file) {
            cb(null, true);
        } else {
            cb(new Error('Only .zip files are allowed!'), false);
        }
    }
}).single('file');

module.exports = {
    uploadProjectZip,
     uploadProfilePhoto,
     uploadMaterialFile,
     uploadMaterialZip,
};