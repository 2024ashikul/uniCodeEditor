import { Model, DataTypes, Sequelize } from 'sequelize';

export class Announcement extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public pinned!: boolean;
  public attachment!: string | null;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, defaultValue: "Info" },
      pinned: { type: DataTypes.BOOLEAN, defaultValue: false },
      attachment: { type: DataTypes.STRING, allowNull: true },
    }, { sequelize, tableName: 'announcements' });
  }

  public static associate(models: any) {
    this.belongsTo(models.Room, { foreignKey: 'roomId' });
    this.belongsTo(models.User, { foreignKey: 'userId' });
  }
}