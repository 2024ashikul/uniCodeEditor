const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize, DataTypes) => {
    const Problem = Sequelize.define('problem', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        statement: { type: DataTypes.TEXT, allowNull: true },
        fullmarks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
        topic: { type: DataTypes.STRING, allowNull: true },
        options: {
            type: DataTypes.JSON,
            allowNull: true
        },
        correctAnswer: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type : { type: DataTypes.STRING, allowNull: true},
    })
    return Problem;
}