const { User, Admin } = require("../models");

const jwt = require('jsonwebtoken')
SECRET = "hi tehre"


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
            res.status(404).json({ message: 'Could not found user' ,type : 'warning'});
        }

        const token = jwt.sign({ email: form.email, userId: newItem.id ,name : newItem.name}, SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'logged in', token });
    } catch (err) {
        console.log(err)
    }
}

exports.check = async (req, res) => {
    const auth = req.headers.authorization;

    if (!auth) return res.sendStatus(401);
    // if (!token) return res.status(401).json({ message: 'Not logged in' });

    try {
        const decoded = jwt.verify(auth.split(" ")[1], SECRET);
        res.json({ msg: `Hello, ${decoded.email}` });
    } catch {
        res.sendStatus(403);
    }
};