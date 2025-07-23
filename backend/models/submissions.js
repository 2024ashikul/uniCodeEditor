const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize , DataTypes) => {
    const Submission = Sequelize.define('submissions',{
        id : {type : DataTypes.INTEGER , autoIncrement : true, primaryKey : true},
        time : {type : DataTypes.DATE , allowNull : false , default : Sequelize.NOW},
        file : {type : DataTypes.STRING, allowNull :false},
        ext : {type : DataTypes.STRING, allowNull :false},
        AIscore : {type : DataTypes.INTEGER, allowNull :true},
        FinalScore : {type : DataTypes.INTEGER, allowNull :true},
    })
    return Submission;
}