import 'dotenv/config';

export const env = {
  GEMINI_API_KEY : process.env.GEMINI_API_KEY || 'non',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  SECRET:process.env.SECRET,
  REFRESH_SECRET : process.env.REFRESH_SECRET,
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mongo',
  
};