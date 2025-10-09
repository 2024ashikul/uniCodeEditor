"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = void 0;
const sequelize_1 = require("sequelize");
class Announcement extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            category: { type: sequelize_1.DataTypes.STRING, defaultValue: "Info" },
            pinned: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
            attachment: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        }, { sequelize, tableName: 'announcements' });
    }
    static associate(models) {
        this.belongsTo(models.Room, { foreignKey: 'roomId' });
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
}
exports.Announcement = Announcement;
