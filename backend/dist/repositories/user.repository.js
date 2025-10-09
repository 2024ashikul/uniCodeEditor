"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const models_1 = require("../models");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
class UserRepository {
    async findByEmail(email) {
        return models_1.db.User.findOne({ where: { email } });
    }
    async findById(id) {
        return models_1.db.User.findByPk(id);
    }
    async create(data) {
        return models_1.db.User.create(data);
    }
    async save(user) {
        return user.save();
    }
    async saveProfilePhoto(tempPath, finalPath) {
        await promises_1.default.mkdir(path_1.default.dirname(finalPath), { recursive: true });
        await promises_1.default.rename(tempPath, finalPath);
    }
    async deleteFile(filePath) {
        try {
            await promises_1.default.unlink(filePath);
        }
        catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }
}
exports.UserRepository = UserRepository;
