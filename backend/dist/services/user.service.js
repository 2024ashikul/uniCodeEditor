"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const SECRET = process.env.SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
class UserService {
    constructor() {
        this.userRepo = new user_repository_1.UserRepository();
    }
    async hashPassword(plainPassword) {
        const saltRounds = 12;
        return bcrypt.hash(plainPassword, saltRounds);
    }
    generateTokens(user) {
        const accessToken = jwt.sign({ email: user.email, userId: user.id, name: user.name, username: user.username }, SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
    async signup(form) {
        const existingUser = await this.userRepo.findByEmail(form.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await this.hashPassword(form.password);
        return this.userRepo.create({
            email: form.email,
            name: form.name,
            username: form.username,
            password: hashedPassword
        });
    }
    async login(form) {
        const user = await this.userRepo.findByEmail(form.email);
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(form.password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const { accessToken, refreshToken } = this.generateTokens(user);
        return { accessToken, refreshToken, user };
    }
    async refreshToken(token) {
        const payload = jwt.verify(token, REFRESH_SECRET);
        const user = await this.userRepo.findById(payload.userId);
        if (!user) {
            throw new Error('User not found for refresh token');
        }
        const { accessToken } = this.generateTokens(user);
        return accessToken;
    }
    async editProfile(userId, formData) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.name = formData.name;
        user.username = formData.username;
        user.bio = formData.bio;
        user.github = formData.github;
        user.linkedin = formData.linkedin;
        user.institution = formData.institution;
        const updatedUser = await this.userRepo.save(user);
        const { accessToken } = this.generateTokens(updatedUser);
        return { token: accessToken, user: updatedUser };
    }
    async getProfile(userId) {
        return this.userRepo.findById(userId);
    }
    async changePassword(userId, currentPass, newPass) {
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new Error('User not found');
        const isMatch = await bcrypt.compare(currentPass, user.password);
        if (!isMatch)
            throw new Error('Current password does not match');
        user.password = await this.hashPassword(newPass);
        await this.userRepo.save(user);
    }
    async uploadProfilePhoto(userId, file) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            // Clean up uploaded file if user is not found
            await fs.unlink(file.path);
            throw new Error('User not found');
        }
        const fileExtension = path.extname(file.originalname);
        const filename = `${userId}-${Date.now()}${fileExtension}`;
        const destinationPath = path.join(process.cwd(), 'uploads', 'profile_photos', filename);
        await this.userRepo.saveProfilePhoto(file.path, destinationPath);
        user.profile_pic = filename;
        await this.userRepo.save(user);
        return user.profile_pic;
    }
}
exports.UserService = UserService;
