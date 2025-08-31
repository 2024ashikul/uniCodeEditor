const { User, Admin } = require("../models");

const jwt = require('jsonwebtoken')
SECRET = "hi tehre"
REFRESH_SECRET = 'hi there'

exports.signup = async (req, res) => {
    try {
        const form = req.body.form;
        console.log(form);
        const findUser = await User.findOne({
            where : {email : form.email}
        })
        if(findUser){
            return res.status(409).json({ message: 'User alreday exists',type : 'warning' });
        }

        const newItem = await User.create({
            email: form.email,
            name: form.name,
        });

        return res.status(201).json({ message: 'created succesfully',type : 'success' });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error', error: err.message });
    }

}

exports.login = async (req, res) => {
    const form = req.body.form;
    console.log(form);
    try {

        const newItem = await User.findOne({
            where: {
                email: form.email
            }
        });
        if (!newItem) {
            return res.status(404).json({ message: 'Could not found user' ,type : 'warning'});
        }

        const token = jwt.sign({ email: form.email, userId: newItem.id ,name : newItem.name}, SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign(
            { userId: newItem.id },
            REFRESH_SECRET, 
            { expiresIn: '7d' }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // true if using HTTPS
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        return res.status(201).json({ message: 'logged in', token });
    } catch (err) {
        console.log(err)
    }
}


exports.refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, REFRESH_SECRET);
        const newAccessToken = jwt.sign(
            { userId: payload.userId },
            SECRET,
            { expiresIn: '1d' }
        );
        res.json({ token: newAccessToken });
    } catch (err) {
        return res.sendStatus(403);
    }
};


// exports.verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.sendStatus(401);

//     const token = authHeader.split(" ")[1];
//     try {
//         const decoded = jwt.verify(token, SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         return res.sendStatus(403);
//     }
// };