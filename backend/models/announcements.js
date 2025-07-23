const { Sequelize, DataTypes } = require("sequelize");


module.exports = (Sequelize , DataTypes) => {
    const Announcement = Sequelize.define('announcement' , {
        id : {type : DataTypes.INTEGER ,autoIncrement : true , primaryKey : true  },
        title : {type : DataTypes.STRING ,allowNull : false},
        description : {type : DataTypes.STRING, allowNull : false}
    });
    return Announcement;
}