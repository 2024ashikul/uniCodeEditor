import { Model, DataTypes, Sequelize } from 'sequelize';

export class Meeting extends Model {
  public id!: number;
  public roomId!: number;
  public host!: number;
  public type!: string | null;
  public status!: string | null;
  public start_time!: string | null;
  public end_time!: string | null;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      roomId: { type: DataTypes.INTEGER, allowNull: false },
      host: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: true },
      status: { type: DataTypes.STRING, allowNull: true },
      start_time: { type: DataTypes.STRING, allowNull: true },
      end_time: { type: DataTypes.STRING, allowNull: true },
    }, { sequelize, tableName: 'meetings' });
  }
  public static associate(models: any) {
    
  }
  
}