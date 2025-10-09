"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Problem = void 0;
const sequelize_1 = require("sequelize");
class Problem extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            statement: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
            fullmarks: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
            topic: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            options: { type: sequelize_1.DataTypes.JSON, allowNull: true },
            correctAnswer: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            type: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        }, { sequelize, tableName: 'problems' });
    }
    static associate(models) {
        this.belongsTo(models.Assessment, { foreignKey: 'assessmentId' });
        this.hasMany(models.Submission, { foreignKey: 'problemId' });
    }
}
exports.Problem = Problem;
