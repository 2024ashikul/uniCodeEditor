const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize , DataTypes) => {
    const Problem = Sequelize.define('problem', {
        id : {type : DataTypes.INTEGER , autoIncrement : true, primaryKey : true },
        title : {type : DataTypes.STRING , allowNull : false},
        statement : {type : DataTypes.TEXT , allowNull : false},
        fullmarks: {type : DataTypes.INTEGER, allowNull: false, defaultValue: 10},
        topic : {type : DataTypes.STRING , allowNull : true},
    })
    return Problem;
}