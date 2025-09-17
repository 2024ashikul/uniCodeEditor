

const fs = require('fs').promises;
const { Rooms, RoomMembers, User, Announcement, Assessment, Submission, Problem, Lesson, LessonM, sequelize, Material } = require("../models");

exports.fetchall = async (req, res) => {
    const { roomId } = req.body;
    try {
        const materials = await Material.findAll({
            where: {
                roomId: roomId
            }
        })
        return res.status(200).json(materials)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error occured' })
    }
}

exports.delete = async (req, res) => {
    const { materialId,roomId } = req.body;
    try {
        const material = await Material.findOne({
            where: {
                id: materialId
            }
        })
        const filePath = path.join(process.cwd(), "uploads","materials",`${roomId}` ,material.filename);
        try {
            await fs.unlink(filePath);
            console.log(`File deleted: ${filePath}`);
        } catch (err) {
            return res.status(200).json({message : 'Could not delte file'})
        }
        
        await material.destroy();

        return res.status(200).json({ message: 'Material destroyed successfully' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error occured' })
    }
}


exports.uploadFolder = async (req, res) => {

    console.log(req);
    if (!req.file) {
        console.log("here")
        return res.status(400).json({ message: "No file was uploaded." });
    }
    const tempFilePath = req.file.path;

    try {
        const { roomId, mode } = req.body;
        const userId = req.user.userId;
        let originalFilename = req.file.originalname;
        const extension = path.extname(req.file.path);
        const baseName = path.basename(originalFilename, extension);
        let counter = 1;
        let newFilename = originalFilename;
        let existingMaterial = await Material.findOne({
            where: {
                filename: newFilename,
                type: 'folder',
                roomId: roomId
            }
        });
        while (existingMaterial) {
            newFilename = `${baseName}(${counter})${extension}`; 
            counter++;
            existingMaterial = await Material.findOne({
                where: {
                    filename: newFilename,
                    type: 'folder',
                    roomId: roomId
                }
            });
        }



        if (!roomId || !userId) {
            console.log("If validation fails, we must delete the uploaded temp file");
            await fs.unlink(tempFilePath);
            return res.status(400).json({ message: "Missing assessment or student information." });
        }

        console.log("Step 1");
        const foldername = `${roomId}}`;

        const destinationFolder = path.join(process.cwd(), 'uploads', 'materials', `${roomId}`);

        console.log("Step 2");


        await fs.mkdir(destinationFolder, { recursive: true });
        const destinationPath = path.join(destinationFolder, originalFilename);
        await fs.rename(tempFilePath, destinationPath);

        const newMaterial = await Material.create({
            filename: newFilename,
            type: 'folder',
            file_extension: extension,
            userId: userId,
            roomId: roomId
        })

        if(newMaterial){
            await Announcement.create({
                title : `New material ${baseName} uploaded`,
                description : '',
                category : 'Material',
                attachment : newMaterial.filename,
                roomId : roomId,
                userId : userId
            })
        }
        res.status(200).json({
            message: 'Project uploaded and extracted successfully!',
            newMaterial
        });

    } catch (err) {
        console.error("Error processing project submission:", err);
        try {
            await fs.unlink(tempFilePath);
        } catch (cleanupErr) {

            console.error('Failed to clean up temporary file:', cleanupErr);
        }

        res.status(500).json({ message: 'Failed to process the uploaded project.' });
    }
};



exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file was uploaded." });
    }

    try {
        const { roomId } = req.body;
        const tempFilePath = req.file.path;
        const userId = req.user.userId;

        let originalFilename = req.file.originalname;
        const extension = path.extname(req.file.path);
        const baseName = path.basename(originalFilename, extension);
        let counter = 1;
        let newFilename = originalFilename;
        let existingMaterial = await Material.findOne({
            where: {
                filename: newFilename,
                type: 'file',
                roomId: roomId
            }
        });
        while (existingMaterial) {
            newFilename = `${baseName}(${counter})${extension}`;
            counter++;
            existingMaterial = await Material.findOne({
                where: {
                    filename: newFilename,
                    type: 'folder',
                    roomId: roomId
                }
            });
        }

        if (!userId || !roomId) {
            await fs.unlink(tempFilePath);
            return res.status(401).json({ message: "User not authenticated." });
        }

        const filename = req.file.originalname;
        const destinationPath = path.join(process.cwd(), 'uploads', 'materials', `${roomId}`, filename);
        await fs.mkdir(path.dirname(destinationPath), { recursive: true });

        await fs.rename(tempFilePath, destinationPath);

        const newMaterial = await Material.create({
            filename: filename,
            file_extension: extension,
            type: 'file',
            userId: userId,
            roomId: roomId
        })

        res.status(200).json({
            message: 'Profile photo updated successfully!',
            newMaterial
        });

    } catch (err) {
        console.error("Error updating profile photo:", err);
        
        try {
            if (tempFilePath) await fs.unlink(tempFilePath);
        } catch (cleanupErr) {
            console.error('Failed to clean up temporary file:', cleanupErr);
        }
        res.status(500).json({ message: 'Failed to update profile photo.' });
    }
};

