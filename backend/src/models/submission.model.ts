import { Model, DataTypes, Sequelize } from 'sequelize';

export class Submission extends Model {
  public id!: number;
  public time!: Date;
  public file!: string | null;
  public ext!: string | null;
  public AIscore!: number | null;
  public FinalScore!: number | null;
  public category!: string | null;
  public submittedoption!: string | null;
  public submittedanswer!: string | null;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      file: { type: DataTypes.STRING, allowNull: true },
      ext: { type: DataTypes.STRING, allowNull: true },
      AIscore: { type: DataTypes.INTEGER, allowNull: true },
      FinalScore: { type: DataTypes.INTEGER, allowNull: true },
      category: { type: DataTypes.STRING, allowNull: true },
      submittedoption: { type: DataTypes.STRING, allowNull: true },
      submittedanswer: { type: DataTypes.STRING, allowNull: true },
    }, { sequelize, tableName: 'submissions' });
  }

  public static associate(models: any) {
    this.belongsTo(models.Problem, { foreignKey: 'problemId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
  }
}