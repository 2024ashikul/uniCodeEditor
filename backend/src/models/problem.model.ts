import { Model, DataTypes, Sequelize } from 'sequelize';

export class Problem extends Model {
  public id!: number;
  public title!: string;
  public statement!: string | null;
  public fullmarks!: number;
  public topic!: string | null;
  public options!: object | null; // JSON can be represented as an object
  public correctAnswer!: string | null;
  public type!: string | null;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      statement: { type: DataTypes.TEXT, allowNull: true },
      fullmarks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
      topic: { type: DataTypes.STRING, allowNull: true },
      options: { type: DataTypes.JSON, allowNull: true },
      correctAnswer: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: true },
    }, { sequelize, tableName: 'problems' });
  }

  public static associate(models: any) {
    this.belongsTo(models.Assessment, { foreignKey: 'assessmentId' });
    this.hasMany(models.Submission, { foreignKey: 'problemId' });
  }
}