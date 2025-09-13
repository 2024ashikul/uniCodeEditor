const { Sequelize, DataTypes } = require("sequelize");
const admin = require("./admin");


module.exports = (Sequelize , DataTypes) => {
    const Rooms = Sequelize.define('rooms',{
        id : {type : DataTypes.INTEGER , autoIncrement : true, primaryKey : true},
        admin : {type: DataTypes.INTEGER , allowNull : false},
        name : {type : DataTypes.STRING , allowNull : true}
    })
    return Rooms;
}