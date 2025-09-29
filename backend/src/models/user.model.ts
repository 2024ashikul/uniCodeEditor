import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public signuptype!: string;
  public username!: string;
  public address!: string | null;
  public profile_pic!: string | null;
  public bio!: string | null;
  public student_id!: string | null;
  public twitter!: string | null;
  public linkedin!: string | null;
  public github!: string | null;
  public institution!: string | null;

  public static initialize(sequelize: Sequelize) {
    this.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      signuptype: { type: DataTypes.STRING, allowNull: false, defaultValue: "local" },
      username: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: true },
      profile_pic: { type: DataTypes.STRING, allowNull: true },
      bio: { type: DataTypes.STRING, allowNull: true },
      student_id: { type: DataTypes.STRING, allowNull: true },
      twitter: { type: DataTypes.STRING, allowNull: true },
      linkedin: { type: DataTypes.STRING, allowNull: true },
      github: { type: DataTypes.STRING, allowNull: true },
      institution: { type: DataTypes.STRING, allowNull: true }
    }, { sequelize, tableName: 'users' });
  }

  public static associate(models: any) {
    this.hasMany(models.Room, { foreignKey: 'admin' });
    this.belongsToMany(models.Room, { through: models.RoomMember, foreignKey: 'userId', otherKey: 'roomId' });
    this.hasMany(models.Submission, { foreignKey: 'userId', onDelete: 'CASCADE' });
    this.hasMany(models.Announcement, { foreignKey: 'userId', onDelete: 'CASCADE' });
    this.hasMany(models.Assessment, { foreignKey: 'userId', onDelete: 'CASCADE' });
    this.hasMany(models.Material, { foreignKey: 'userId', onDelete: 'CASCADE' });
  }
}