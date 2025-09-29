import { Model, DataTypes, Sequelize } from 'sequelize';

export class Material extends Model {
  public id!: number;
  public filename!: string;
  public file_extension!: string | null;
  public type!: 'folder' | 'file';

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      filename: { type: DataTypes.STRING, allowNull: false },
      file_extension: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.ENUM('folder', 'file'), allowNull: false },
    }, { sequelize, tableName: 'materials' });
  }

  public static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Room, { foreignKey: 'roomId' });
  }
}