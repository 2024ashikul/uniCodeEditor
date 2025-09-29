import { db } from '../models';
import { Submission } from '../models/submission.model';
import { Problem } from '../models/problem.model';
import { Assessment } from '../models/assessment.model';
import { RoomMember } from '../models/roommember.model';
import { User } from '../models/user.model';
import { Op } from 'sequelize';
import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';
import unzipper from 'unzipper';

export class SubmissionRepository {
  
  async bulkCreate(data: any[]): Promise<Submission[]> {
    return db.Submission.bulkCreate(data);
  }

  async create(data: any): Promise<Submission> {
    return db.Submission.create(data);
  }

  async save(submission: Submission): Promise<Submission> {
    return submission.save();
  }

  
  async findAssessmentById(id: number): Promise<Assessment | null> {
    return db.Assessment.findByPk(id);
  }

  async findProblemById(id: number): Promise<Problem | null> {
    return db.Problem.findByPk(id);
  }
  
  async findOneProblemByAssessmentId(assessmentId: number): Promise<Problem | null> {
    return db.Problem.findOne({ where: { assessmentId } });
  }

  async findAllProblemsByAssessmentId(assessmentId: number): Promise<Problem[]> {
    return db.Problem.findAll({ where: { assessmentId } });
  }

  async findAllMembersInRoom(roomId: number, excludeAdmins: boolean = false): Promise<RoomMember[]> {
    const whereClause: any = { roomId };
    if (excludeAdmins) {
      whereClause.role = { [Op.ne]: "admin" };
    }
    return db.RoomMember.findAll({
      where: whereClause,
      include: [{ model: db.User, as: 'user', attributes: ['name', 'email', 'id'] }]
    });
  }
  
  async findSubmissionsByProblemIds(problemIds: number[]): Promise<Submission[]> {
      return db.Submission.findAll({
          where: { problemId: { [Op.in]: problemIds } },
          include: [{ model: db.User, as: 'user', attributes: ['id', 'email', 'name'] }]
      });
  }
  
  async findSubmissionsByProblemIdsAndUser(problemIds: number[], userId: string): Promise<Submission[]> {
      return db.Submission.findAll({
          where: {
              problemId: { [Op.in]: problemIds },
              userId: userId
          },
          include: [{ model: db.User, as: 'user', attributes: ['id', 'email', 'name'] }]
      });
  }
  
  async findOneSubmission(problemId: number, userId: string): Promise<Submission | null> {
    return db.Submission.findOne({ where: { problemId, userId }});
  }

  
  async saveCodeToFile(code: string, timestamp: string, extension: string): Promise<void> {
    const filesDir = path.join(process.cwd(), 'files');
    await fs.mkdir(filesDir, { recursive: true });
    const filePath = path.join(filesDir, `${timestamp}.${extension}`);
    await fs.writeFile(filePath, code);
  }

  async unzipProject(tempPath: string, destinationPath: string): Promise<void> {
    await fs.mkdir(destinationPath, { recursive: true });
    await createReadStream(tempPath).pipe(unzipper.Extract({ path: destinationPath })).promise();
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err; 
    }
  }
}