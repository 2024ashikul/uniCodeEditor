import { Model, DataTypes, Sequelize } from 'sequelize';

export class Room extends Model {
  public id!: number;
  public name!: string | null;
  public admin!: number;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      admin: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: true }
    }, { sequelize, tableName: 'rooms' });
  }

  public static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'admin' });
    this.belongsToMany(models.User, { through: models.RoomMember, foreignKey: 'roomId', otherKey: 'userId' });
    this.hasMany(models.Announcement, { foreignKey: 'roomId', onDelete: 'CASCADE' });
    this.hasMany(models.Assessment, { foreignKey: 'roomId', onDelete: 'CASCADE' });
    this.hasMany(models.LessonM, { foreignKey: 'roomId', onDelete: 'CASCADE' });
    this.hasMany(models.Material, { foreignKey: 'roomId', onDelete: 'CASCADE' });
  }
}