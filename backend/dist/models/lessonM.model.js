"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonM = void 0;
const sequelize_1 = require("sequelize");
class LessonM extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            status: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: "draft" },
            attachment: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            category: { type: sequelize_1.DataTypes.STRING, allowNull: true }
        }, { sequelize, tableName: 'lessons' });
    }
    static associate(models) {
        this.belongsTo(models.Room, { foreignKey: 'roomId' });
        this.hasMany(models.LessonContent, { foreignKey: 'lessonId', onDelete: 'CASCADE', as: 'lessonContents' });
    }
}
exports.LessonM = LessonM;
