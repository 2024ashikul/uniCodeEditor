import { Model, DataTypes, Sequelize } from 'sequelize';

export class LessonContent extends Model {
  public id!: number;
  public type!: 'text' | 'image' | 'video';
  public content!: string;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      type: {
        type: DataTypes.ENUM('text', 'image', 'video'),
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT, 
        allowNull: false
      }
    }, { sequelize, tableName: 'lesson_contents' });
  }

  public static associate(models: any) {
    
    this.belongsTo(models.LessonM, { foreignKey: 'lessonId' });
  }
}