"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    static initialize(sequelize) {
        this.init({
            id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            signuptype: { type: sequelize_1.DataTypes.STRING, allowNull: false, defaultValue: "local" },
            username: { type: sequelize_1.DataTypes.STRING, allowNull: false },
            address: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            profile_pic: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            bio: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            student_id: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            twitter: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            linkedin: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            github: { type: sequelize_1.DataTypes.STRING, allowNull: true },
            institution: { type: sequelize_1.DataTypes.STRING, allowNull: true }
        }, { sequelize, tableName: 'users' });
    }
    static associate(models) {
        this.hasMany(models.Room, { foreignKey: 'admin' });
        this.belongsToMany(models.Room, { through: models.RoomMember, foreignKey: 'userId', otherKey: 'roomId' });
        this.hasMany(models.Submission, { foreignKey: 'userId', onDelete: 'CASCADE' });
        this.hasMany(models.Announcement, { foreignKey: 'userId', onDelete: 'CASCADE' });
        this.hasMany(models.Assessment, { foreignKey: 'userId', onDelete: 'CASCADE' });
        this.hasMany(models.Material, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
}
exports.User = User;
