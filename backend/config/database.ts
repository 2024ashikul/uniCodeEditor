import { Sequelize } from 'sequelize';
import 'dotenv/config';


const isProduction = process.env.NODE_ENV === 'production';

const sequelize = isProduction
  ? new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD!,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: Number(process.env.DB_PORT || 5432),
        logging: false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    )
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite', 
      logging: false,
    });

export default sequelize;