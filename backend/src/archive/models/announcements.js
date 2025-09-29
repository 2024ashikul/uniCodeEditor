const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize, DataTypes) => {
    const Announcement = Sequelize.define('announcement', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.STRING, defaultValue: "Info" },
        pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
        attachment: { type: DataTypes.STRING, allowNull: true },
    });
    return Announcement;
}