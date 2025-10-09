"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meeting = void 0;
const sequelize_1 = require("sequelize");
class Meeting extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            roomId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            host: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
            type: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            status: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            start_time: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            end_time: { type: sequelize_1.DataTypes.STRING, allowNull: true },
        }, { sequelize, tableName: 'meetings' });
    }
    static associate(models) {
    }
}
exports.Meeting = Meeting;
