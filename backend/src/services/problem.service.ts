import { ProblemRepository } from '../repositories/problem.repository';
import { Problem } from '../models/problem.model';

export class ProblemService {
  private problemRepo: ProblemRepository;

  constructor() {
    this.problemRepo = new ProblemRepository();
  }

  async createProblem(assessmentId: number, form: any, type: string): Promise<Problem> {
    let problemData: any = {
      assessmentId,
      title: form.title,
    };

    
    if (type === 'MCQ') {
      problemData = { ...problemData, type: "MCQ", options: form.options, fullmarks: form.fullmarks || 1, correctAnswer: form.correctAnswer };
    } else if (type === 'ShortQuestion') {
      problemData = { ...problemData, type: "ShortQuestion", fullmarks: form.fullmarks || 5, correctAnswer: form.correctAnswer };
    } else {
      problemData = { ...problemData, statement: form.statement, fullmarks: form.fullmarks || 10 };
    }

    return this.problemRepo.create(problemData);
  }
  
  async updateProblem(problemId: number, form: any, type: string): Promise<Problem> {
    const problem = await this.problemRepo.findById(problemId);
    if (!problem) throw new Error('Problem not found');

    
    if (type === "MCQ") {
        problem.title = form.title;
        problem.options = form.options;
        problem.fullmarks = form.fullmarks || 1;
        problem.correctAnswer = form.correctAnswer;
    } else if (type == 'ShortQuestion') {
        problem.title = form.title;
        problem.fullmarks = form.fullmarks || 5;
        problem.correctAnswer = form.correctAnswer;
    } else {
        problem.title = form.title;
        problem.statement = form.statement;
        problem.fullmarks = form.fullmarks || problem.fullmarks;
        problem.correctAnswer = form.correctAnswer;
    }
    
    await problem.save();
    return problem;
  }

  async getProjectWithSubmissionStatus(assessmentId: number, userId: string) {
    const problem = await this.problemRepo.findOneByAssessmentId(assessmentId);
    if (!problem) return { problem: null, submitted: false };

    const submission = await this.problemRepo.findUserSubmissionForProblem(problem.id, userId);
    return { problem, submission, submitted: !!submission };
  }

  async getQuizWithSubmissionStatus(assessmentId: number, userId: string) {
    const problems = await this.problemRepo.findAllByAssessmentId(assessmentId);
    if (problems.length === 0) {
      return { problems: [], submissions: [], submitted: false };
    }
    
    const problemIds = problems.map(p => p.id);
    const submissions = await this.problemRepo.findUserSubmissionsForProblems(problemIds, userId);
    
    return { problems, submissions, submitted: submissions.length > 0 };
  }

  async deleteProblem(problemId: number): Promise<boolean> {
      const deletedCount = await this.problemRepo.deleteById(problemId);
      if (deletedCount === 0) throw new Error('Problem not found or already deleted');
      return true;
  }

  async findOne(problemId: number): Promise<Problem | null> {
      return this.problemRepo.findById(problemId);
  }
  
  async findAll(assessmentId: number): Promise<Problem[]> {
      return this.problemRepo.findAllByAssessmentId(assessmentId);
  }
}