import { db } from '../models';
import { User } from '../models/user.model';
import fs from 'fs/promises';
import path from 'path';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: any): Promise<User>;
  save(user: User): Promise<User>;
  saveProfilePhoto(tempPath: string, finalPath: string): Promise<void>;
  deleteFile(filePath: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return db.User.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return db.User.findByPk(id);
  }

  async create(data: any): Promise<User> {
    return db.User.create(data);
  }

  async save(user: User): Promise<User> {
    return user.save();
  }

  async saveProfilePhoto(tempPath: string, finalPath: string): Promise<void> {
    await fs.mkdir(path.dirname(finalPath), { recursive: true });
    await fs.rename(tempPath, finalPath);
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') { throw error; }
    }
  }
}