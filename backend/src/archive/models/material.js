const { Sequelize, DataTypes } = require("sequelize");



module.exports = (Sequelize , DataTypes) => {
    const Material = Sequelize.define('materials',{
        id : { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        filename : {type : DataTypes.STRING , allowNull : false},
        file_extension : {type : DataTypes.STRING , allowNull : true},
        type : {type: DataTypes.ENUM('folder','file'), allowNull: false},
    })
    return Material;
}