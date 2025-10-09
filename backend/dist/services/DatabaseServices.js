"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const database_1 = __importDefault(require("../config/database"));
class DatabaseService {
    async connect() {
        try {
            await this.connectSequelize();
            // await this.connectMongoose();
        }
        catch (error) {
            console.error('❌ Failed to connect to databases.');
            throw error;
        }
    }
    async connectSequelize() {
        await database_1.default.authenticate();
        console.log('🔗 Connected to Sequelize (PostgreSQL/SQLite) successfully.');
        await database_1.default.sync();
        console.log('🔄 All Sequelize tables synced!');
    }
}
exports.DatabaseService = DatabaseService;
