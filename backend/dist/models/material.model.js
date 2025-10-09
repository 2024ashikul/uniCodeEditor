"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Material = void 0;
const sequelize_1 = require("sequelize");
class Material extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            filename: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            file_extension: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            type: { type: sequelize_1.DataTypes.ENUM('folder', 'file'), allowNull: false },
        }, { sequelize, tableName: 'materials' });
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'userId' });
        this.belongsTo(models.Room, { foreignKey: 'roomId' });
    }
}
exports.Material = Material;
