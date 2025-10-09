import { Model, DataTypes, Sequelize } from 'sequelize';

export class LessonM extends Model {
  public id!: number;
  public title!: string;
  public status!: string;
  public attachment!: string | null;
  public category!: string | null;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false, defaultValue: "draft" },
      attachment: { type: DataTypes.STRING, allowNull: true },
      category: { type: DataTypes.STRING, allowNull: true }
    }, { sequelize, tableName: 'lessons' }); 
  }

  public static associate(models: any) {
   
    this.belongsTo(models.Room, { foreignKey: 'roomId' });
    
    
    this.hasMany(models.LessonContent, { foreignKey: 'lessonId', onDelete: 'CASCADE',as :'lessonContents' });
  }
}