const { Sequelize, DataTypes, DATE } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    const Assessment = Sequelize.define('assessment', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        category: { type: DataTypes.ENUM("CodeAssignment", "AssignmentProject", "Quiz", "ShortAnswer", "More"), defaultValue: "CodeAssignment" },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Not Scheduled' },
        scheduleTime: { type: DataTypes.DATE, allowNull: true },
        duration: { type: DataTypes.INTEGER, allowNull: true },
        everyoneseesresults: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
        resultpublished: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
        pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
        attachment: { type: DataTypes.STRING, allowNull: true },
        category: { type: DataTypes.STRING, allowNull: true },
        assigned : {type : DataTypes.BOOLEAN, allowNull : false , defaultValue : false}
    });
    return Assessment;
}