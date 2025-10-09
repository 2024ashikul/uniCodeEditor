"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonContent = void 0;
const sequelize_1 = require("sequelize");
class LessonContent extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            type: {
                type: sequelize_1.DataTypes.ENUM('text', 'image', 'video'),
                allowNull: false
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            }
        }, { sequelize, tableName: 'lesson_contents' });
    }
    static associate(models) {
        this.belongsTo(models.LessonM, { foreignKey: 'lessonId' });
    }
}
exports.LessonContent = LessonContent;
