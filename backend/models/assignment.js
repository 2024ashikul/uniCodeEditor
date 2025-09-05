const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize , DataTypes) => {
    const Assignment = Sequelize.define('assignment' , {
        id : {type : DataTypes.INTEGER ,autoIncrement : true , primaryKey : true  },
        title : {type : DataTypes.STRING ,allowNull : false},
        description : {type : DataTypes.STRING, allowNull : false},
        status : {type : DataTypes.STRING , allowNull : false, defaultValue : 'Not Scheduled'},
        scheduleTime : {type : DataTypes.STRING , allowNull : true},
        duration : {type : DataTypes.STRING , allowNull : true},
        everyoneseesresults : {type : DataTypes.BOOLEAN , allowNull : true, defaultValue : false},
        resultpublished : {type : DataTypes.BOOLEAN , allowNull : true, defaultValue : false},
    });
    return Assignment;
}