const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize, DataTypes) => {
    const User = Sequelize.define('users',{
        id : {type : DataTypes.INTEGER, autoIncrement : true , primaryKey : true},
        name : { type : DataTypes.STRING, allowNull : false},
        email : {type : DataTypes.STRING , allowNull : false},
        password : {type : DataTypes.STRING, allowNull : false},
        signuptype :  {type : DataTypes.STRING, allowNull : false,defaultValue: "local"},
        username  : {type : DataTypes.STRING, allowNull : false},
        address : {type : DataTypes.STRING , allowNull : true},
        profile_pic : {type : DataTypes.STRING , allowNull : true},
        bio : {type : DataTypes.STRING, allowNull : true},
        student_id : {type : DataTypes.STRING , allowNull : true}
    });
    return User;

}