const { User, Admin } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET
const path = require('path')
const fs = require('fs').promises;

async function hashPassword(plainPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
}

exports.signup = async (req, res) => {
    try {
        const { form } = req.body;
        console.log(form);
        const findUser = await User.findOne({
            where: { email: form.email }
        })
        if (findUser) {
            return res.status(409).json({ message: 'User alreday exists' });
        }
        const password = await hashPassword(form.password);

        await User.create({
            email: form.email,
            name: form.name,
            username: form.username,
            password: password
        });
        return res.status(201).json({ message: 'Signed up succesfully!!!' });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server error' });
    }

}

exports.login = async (req, res) => {
    const { form } = req.body;
    console.log(form);
    try {
        const user = await User.findOne({
            where: {
                email: form.email
            },
           
        });
        if (!user) {
            return res.status(404).json({ message: 'Could not found user!' });
        }

        const match = await bcrypt.compare(form.password, user.password);
        if (match) {
            const token = jwt.sign({
                email: form.email,
                userId: user.id,
                name: user.name,
                username: user.username
            },
                SECRET,
                { expiresIn: '1d' });
            const refreshToken = jwt.sign(
                { userId: user.id },
                REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ message: 'logged in', token , user });
        } else {
            return res.status(401).json({ message: 'Password/Email does not match!' })
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal server Error!' })
    }
}

exports.refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token provided." });
    try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        const user = await User.findByPk(payload.userId);
        if (!user) {
            return res.status(403).json({ message: "User not found." });
        }

        const newAccessToken = jwt.sign(
            {
                email: user.email,
                userId: user.id,
                name: user.name,
                username: user.username
            },
            SECRET,
            { expiresIn: '1d' }
        );


        res.json({ token: newAccessToken });

    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: "Invalid refresh token." });
    }
};


exports.logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

exports.editprofile = async (req, res) => {

    const { formData } = req.body;

    try {
        const user = await User.findByPk(req.user.userId);
        user.name = formData.name;
        user.username = formData.username;
        user.bio = formData.bio;
        user.github = formData.github;
        user.linkedin = formData.linkedin;
        user.institution = formData.institution;
        await user.save();

        const newToken = jwt.sign(
            {
                email: user.email,
                userId: user.id,
                name: user.name,
                username: user.username
            },
            SECRET,
            { expiresIn: "1d" }
        );
        // console.log(newToken)

        return res.status(200).json({
            message: "Profile Updated Successfully",
            token: newToken,
            updatedUser: user
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error!' })
    }

}

exports.getprofile = async (req, res) => {

    try {
        const { userId } = req.body;
        const user = await User.findOne({
            where: {
                id: userId
            },
            attributes: ['name', 'email', 'password', 'username', 'profile_pic', 'bio', 'linkedin', 'github', 'institution']
        })
        return res.status(200).json({ user })
    } catch (err) {
        console.log(err)
    }
}

exports.changePassword = async (req, res) => {

    try {
        const { passwordData } = req.body;
        const user = await User.findOne({
            where: {
                id: req.user.userId
            },
            attributes: ['password', 'id']
        })

        const match = await bcrypt.compare(passwordData.currentPassword, user.password);

        if (match) {
            const password = await hashPassword(passwordData.newPassword);
            user.password = password;
            await user.save();
            return res.status(200).json({ message: 'Password changed successfully!' });
        } else {
            return res.status(200).json({ message: 'Password does not match!' });
        }



    } catch (err) {
        console.log(err)
    }

}

exports.uploadProfilePhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image was uploaded." });
    }

    const tempFilePath = req.file.path;
    // Get file extension (e.g., '.png', '.jpg')
    const fileExtension = path.extname(req.file.originalname);

    try {
        const userId = req.user.userId;
        if (!userId) {
            await fs.unlink(tempFilePath);
            return res.status(401).json({ message: "User not authenticated." });
        }

        // Define a simple, predictable filename
        const filename = `${userId}-${Date.now()}${fileExtension}`;
        const destinationPath = path.join(process.cwd(), 'uploads', 'profile_photos', filename);

        // Ensure the destination directory exists
        await fs.mkdir(path.dirname(destinationPath), { recursive: true });

        // Move the file from the temp location to the final destination
        await fs.rename(tempFilePath, destinationPath);

        // Update the User model with the path to their new photo
        const updatedUser = await User.findByPk(userId);
        updatedUser.profile_pic = filename;
        await updatedUser.save();

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
            message: 'Profile photo updated successfully!',
            profilePhotoUrl: updatedUser.profile_pic
        });

    } catch (err) {
        console.error("Error updating profile photo:", err);
        // Attempt to clean up the temporary file
        try {
            if (tempFilePath) await fs.unlink(tempFilePath);
        } catch (cleanupErr) {
            console.error('Failed to clean up temporary file:', cleanupErr);
        }
        res.status(500).json({ message: 'Failed to update profile photo.' });
    }
};