const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize, DataTypes) => {
    const RoomMembers = Sequelize.define('roommembers', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        role: { type: DataTypes.ENUM('admin', 'member'), allowNull: false },
        joinedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    })
    
    return RoomMembers;
}

