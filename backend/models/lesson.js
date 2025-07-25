const { Sequelize, DataTypes } = require("sequelize");



module.exports = (Sequelize,DataTypes) => {
    const Lesson = Sequelize.define('lessons',{
        id : { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title : {type : DataTypes.STRING , allowNull : false}
    })
    return Lesson;
}