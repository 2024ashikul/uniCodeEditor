const { Sequelize, DataTypes } = require("sequelize");



module.exports = (Sequelize, DataTypes) => {
    const Meeting = Sequelize.define('meeting',{
        id : {type : DataTypes.INTEGER , autoIncrement : true, primaryKey : true },
        roomId : {type : DataTypes.INTEGER, allowNull : false},
        host : {type : DataTypes.INTEGER, allowNull : false},
        type : {type : DataTypes.STRING, allowNull : true},
        status : {type : DataTypes.STRING, allowNull : true},
        start_time : {type : DataTypes.STRING, allowNull : true},
        end_time : {type : DataTypes.STRING, allowNull : true},
    })
    return Meeting;
}