const { User, Admin } = require("../models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

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
            }
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
                username : user.username 
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

            return res.status(200).json({ message: 'logged in', token });
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