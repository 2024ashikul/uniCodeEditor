const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize , DataTypes) => {
    const Submission = Sequelize.define('submissions',{
        id : {type : DataTypes.INTEGER , autoIncrement : true, primaryKey : true},
        time : {type : DataTypes.DATE , allowNull : false , defaultValue : DataTypes.NOW},
        file : {type : DataTypes.STRING, allowNull :true},
        ext : {type : DataTypes.STRING, allowNull :true},
        AIscore : {type : DataTypes.INTEGER, allowNull :true},
        FinalScore : {type : DataTypes.INTEGER, allowNull :true},
        category:{type : DataTypes.STRING, allowNull :true},
        submittedoption:{type : DataTypes.STRING, allowNull :true},
        submittedanswer:{type : DataTypes.STRING, allowNull :true},
    })
    return Submission;
}