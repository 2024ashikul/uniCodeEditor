import { Model, DataTypes, Sequelize } from 'sequelize';

export class RoomMember extends Model {
  public id!: number;
  public role!: 'admin' | 'member';
  public joinedAt!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      role: { type: DataTypes.ENUM('admin', 'member'), allowNull: false },
      joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, { sequelize, tableName: 'roommembers' });
  }

  public static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    this.belongsTo(models.Room, { foreignKey: 'roomId', onDelete: 'CASCADE' });
  }
}