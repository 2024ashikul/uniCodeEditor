import { Model, DataTypes, Sequelize } from 'sequelize';

export class Assessment extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: "CodeAssignment" | "AssignmentProject" | "Quiz" | "ShortAnswer" | "More" | null;
  public status!: string;
  public scheduleTime!: Date | null;
  public duration!: number | null;
  public everyoneseesresults!: boolean | null;
  public resultpublished!: boolean | null;
  public pinned!: boolean;
  public attachment!: string | null;
  public assigned!: boolean;
  

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.ENUM("CodeAssignment", "AssignmentProject", "Quiz", "ShortAnswer", "More"), allowNull: true },
      status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Not Scheduled' },
      scheduleTime: { type: DataTypes.DATE, allowNull: true },
      duration: { type: DataTypes.INTEGER, allowNull: true },
      everyoneseesresults: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      resultpublished: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
      attachment: { type: DataTypes.STRING, allowNull: true },
      assigned: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, { sequelize, tableName: 'assessments' });
  }

  public static associate(models: any) {
    this.belongsTo(models.Room, { foreignKey: 'roomId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.hasMany(models.Problem, { foreignKey: 'assessmentId' });
  }
}