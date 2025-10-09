"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMember = void 0;
const sequelize_1 = require("sequelize");
class RoomMember extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            role: { type: sequelize_1.DataTypes.ENUM('admin', 'member'), allowNull: false },
            joinedAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
        }, { sequelize, tableName: 'roommembers' });
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'user' });
        this.belongsTo(models.Room, { foreignKey: 'roomId', onDelete: 'CASCADE', as: 'room' });
    }
}
exports.RoomMember = RoomMember;
