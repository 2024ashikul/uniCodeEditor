"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.signup = async (req, res) => {
            try {
                await this.service.signup(req.body.form);
                return res.status(201).json({ message: 'Signed up succesfully!' });
            }
            catch (err) {
                if (err.message.includes('already exists')) {
                    return res.status(409).json({ message: err.message });
                }
                return res.status(500).json({ message: err.message });
            }
        };
        this.login = async (req, res) => {
            try {
                const { accessToken, refreshToken, user } = await this.service.login(req.body.form);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure:env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                return res.status(200).json({ message: 'Logged in successfully', token: accessToken, user });
            }
            catch (err) {
                if (err.message === 'User not found') {
                    return res.status(404).json({ message: err.message });
                }
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        };
        this.refreshToken = async (req, res) => {
            try {
                const token = req.cookies.refreshToken;
                if (!token)
                    return res.status(401).json({ message: "No refresh token provided." });
                const newAccessToken = await this.service.refreshToken(token);
                return res.json({ token: newAccessToken });
            }
            catch (err) {
                return res.status(403).json({ message: err.message });
            }
        };
        this.logout = async (req, res) => {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            });
            return res.status(200).json({ message: "Logged out successfully" });
        };
        this.editProfile = async (req, res) => {
            try {
                const userId = req.user.userId;
                const { token, user } = await this.service.editProfile(userId, req.body.formData);
                return res.status(200).json({ message: "Profile Updated Successfully", token, updatedUser: user });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.getProfile = async (req, res) => {
            try {
                const { userId } = req.body;
                const user = await this.service.getProfile(userId);
                if (!user)
                    return res.status(404).json({ message: "User not found" });
                // Avoid sending password hash to the client
                const { password, ...userProfile } = user.get({ plain: true });
                return res.status(200).json({ user: userProfile });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.changePassword = async (req, res) => {
            try {
                const userId = req.user.userId;
                const { currentPassword, newPassword } = req.body.passwordData;
                await this.service.changePassword(userId, currentPassword, newPassword);
                return res.status(200).json({ message: 'Password changed successfully!' });
            }
            catch (err) {
                return res.status(401).json({ message: err.message });
            }
        };
        this.uploadProfilePhoto = async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ message: "No image was uploaded." });
                }
                const userId = req.user.userId;
                const profilePhotoUrl = await this.service.uploadProfilePhoto(userId, req.file);
                return res.status(200).json({ message: 'Profile photo updated successfully!', profilePhotoUrl });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.service = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
