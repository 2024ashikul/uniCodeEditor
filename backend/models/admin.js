const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize, DataTypes) => {
    const Admin = Sequelize.define('admin',{
        id : {type : DataTypes.INTEGER, autoIncrement : true , primaryKey : true},
        name : { type : DataTypes.STRING, allowNull : false},
        email : {type : DataTypes.STRING , allowNull : false}
    });
    return Admin;

}