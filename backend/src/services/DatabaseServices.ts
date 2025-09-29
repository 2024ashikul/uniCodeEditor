
import { env } from '../config/environment';
import sequelize from '../config/database';

export class DatabaseService {
  public async connect(): Promise<void> {
    try {
      await this.connectSequelize();
      // await this.connectMongoose();
    } catch (error) {
      console.error('❌ Failed to connect to databases.');
      throw error; 
    }
  }

  private async connectSequelize(): Promise<void> {
    await sequelize.authenticate();
    console.log('🔗 Connected to Sequelize (PostgreSQL/SQLite) successfully.');
    
    await sequelize.sync();
    console.log('🔄 All Sequelize tables synced!');
  }

  // private async connectMongoose(): Promise<void> {
  //   await mongoose.connect(env.MONGO_URI);
  //   console.log('🌿 Connected to Mongoose (MongoDB) successfully.');
  // }
}