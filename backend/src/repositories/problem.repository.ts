import { db } from '../models'; // Your clean, refactored db object
import { Problem } from '../models/problem.model';
import { Submission } from '../models/submission.model';
import { Op } from 'sequelize';
import { CreationAttributes } from 'sequelize';

// DTOs for type safety

type CreateProblemDTO = CreationAttributes<Problem>;

interface UpdateProblemDTO extends CreateProblemDTO {}

export class ProblemRepository {
  async create(data: CreateProblemDTO): Promise<Problem> {
    return db.Problem.create(data);
  }
  
  async update(id: number, data: Partial<UpdateProblemDTO>): Promise<[number]> {
    return db.Problem.update(data, { where: { id } });
  }

  async findById(id: number): Promise<Problem | null> {
    return db.Problem.findByPk(id);
  }

  async findAllByAssessmentId(assessmentId: number): Promise<Problem[]> {
    return db.Problem.findAll({ where: { assessmentId } });
  }

  async findOneByAssessmentId(assessmentId: number): Promise<Problem | null> {
    return db.Problem.findOne({ where: { assessmentId } });
  }

  async findUserSubmissionForProblem(problemId: number, userId: string): Promise<Submission | null> {
    return db.Submission.findOne({ where: { problemId, userId } });
  }

  async findUserSubmissionsForProblems(problemIds: number[], userId: string): Promise<Submission[]> {
    return db.Submission.findAll({
      where: {
        userId,
        problemId: { [Op.in]: problemIds }
      }
    });
  }

  async deleteById(id: number): Promise<number> {
    return db.Problem.destroy({ where: { id } });
  }
}