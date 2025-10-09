"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assessment = void 0;
const sequelize_1 = require("sequelize");
class Assessment extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            description: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            category: { type: sequelize_1.DataTypes.ENUM("CodeAssignment", "AssignmentProject", "Quiz", "ShortAnswer", "More"), allowNull: true },
            status: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: 'Not Scheduled' },
            scheduleTime: { type: sequelize_1.DataTypes.DATE, allowNull: true },
            duration: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
            everyoneseesresults: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            resultpublished: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
            pinned: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
            attachment: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            assigned: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
        }, { sequelize, tableName: 'assessments' });
    }
    static associate(models) {
        this.belongsTo(models.Room, { foreignKey: 'roomId' });
        this.belongsTo(models.User, { foreignKey: 'userId' });
        this.hasMany(models.Problem, { foreignKey: 'assessmentId' });
    }
}
exports.Assessment = Assessment;
