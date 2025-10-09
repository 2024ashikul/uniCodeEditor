"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const sequelize_1 = require("sequelize");
class Room extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            admin: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: true }
        }, { sequelize, tableName: 'rooms' });
    }
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'admin',
            as: 'administrator'
        });
        this.belongsToMany(models.User, {
            through: models.RoomMember,
            foreignKey: 'roomId',
            otherKey: 'userId',
            as: 'members'
        });
        this.hasMany(models.RoomMember, {
            foreignKey: 'roomId',
            as: 'memberships'
        });
        this.hasMany(models.Announcement, { foreignKey: 'roomId', onDelete: 'CASCADE' });
        this.hasMany(models.Assessment, { foreignKey: 'roomId', onDelete: 'CASCADE' });
        this.hasMany(models.LessonM, { foreignKey: 'roomId', onDelete: 'CASCADE' });
        this.hasMany(models.Material, { foreignKey: 'roomId', onDelete: 'CASCADE' });
    }
}
exports.Room = Room;
