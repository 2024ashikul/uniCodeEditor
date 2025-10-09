"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const sequelize_1 = require("sequelize");
class Submission extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            time: { type: sequelize_1.DataTypes.DATE, allowNull: false, defaultValue: sequelize_1.DataTypes.NOW },
            file: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            ext: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            AIscore: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
            FinalScore: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
            category: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            submittedoption: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            submittedanswer: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        }, { sequelize, tableName: 'submissions' });
    }
    static associate(models) {
        this.belongsTo(models.Problem, { foreignKey: 'problemId' });
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
}
exports.Submission = Submission;
