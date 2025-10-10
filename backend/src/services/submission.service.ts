import { SubmissionRepository } from '../repositories/submission.repository';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { Submission } from '../models/submission.model';

export class SubmissionService {
  private repo: SubmissionRepository;
  private ai: GoogleGenAI;

  constructor() {
    this.repo = new SubmissionRepository();
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async createQuizSubmission(assessmentId: number, userId: string, answers: any): Promise<void> {
    const submissionsData = Object.entries(answers).map(([problemId, answer]: [string, any]) => ({
      problemId: parseInt(problemId, 10),
      userId: userId,
      submittedoption: answer.type === 'MCQ' ? answer.answer : null,
      submittedanswer: answer.type === 'ShortQuestion' ? answer.answer : null,
    }));
    await this.repo.bulkCreate(submissionsData);
  }

  async createCodeSubmission(problemId: number, userId: string, code: string, language: string): Promise<Submission> {
    const extensions: { [key: string]: string } = { cpp: 'cpp', c: 'c', javascript: 'js', python: 'py', java: 'java' };
    const extension = extensions[language] || 'txt';
    const timestamp = Date.now().toString();

    await this.repo.saveCodeToFile(code, timestamp, extension);

    const newSubmission = await this.repo.create({
      file: timestamp,
      ext: extension,
      problemId: problemId,
      userId: userId,
      time: new Date()
    });

    this.getAndSaveAIScore(newSubmission, problemId, code, language);
    return newSubmission;
  }

  async createProjectSubmission(problemId: number, assessmentId: number, userId: string, file: any): Promise<Submission> {
    const foldername = `${problemId}-${userId}-${Date.now()}`;
    const destinationPath = path.join(process.cwd(), 'uploads', 'submissions', `assessment-${assessmentId}`, foldername);

    await this.repo.unzipProject(file.path, destinationPath);
    await this.repo.deleteFile(file.path);

    return this.repo.create({ problemId, userId, file: foldername });
  }

  async getAdminQuizResults(assessmentId: number) {
    const assessment = await this.repo.findAssessmentById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");
    const members = await this.repo.findAllMembersInRoom((assessment as any).roomId);
    const problems = await this.repo.findAllProblemsByAssessmentId(assessmentId);

    let results = await Promise.all(
      members.map(async (memberItem) => {
        const member = (memberItem as any).user;
        let totalscore = 0;
        for (const problem of problems) {
          const submission = await this.repo.findOneSubmission(problem.id, member.id);
          if (problem.type === "MCQ" && submission?.submittedoption === problem.correctAnswer) {
            totalscore += problem.fullmarks;
          }
          if (problem.type === "ShortQuestion" && submission?.submittedanswer === problem.correctAnswer) {
            totalscore += problem.fullmarks;
          }
        }
        return { member, totalscore };
      })
    );
    return results.sort((a, b) => b.totalscore - a.totalscore);
  }

  async getUserQuizResults(assessmentId: number, userId: string) {
    const assessment = await this.repo.findAssessmentById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");
    if (!assessment.resultpublished) return { published: false, results: [], problems: [], submissions: [] };

    const problems = await this.repo.findAllProblemsByAssessmentId(assessmentId);
    const problemIds = problems.map(p => p.id);
    const submissions = await this.repo.findSubmissionsByProblemIdsAndUser(problemIds, userId);

    return { published: true, problems, submissions };
  }

  async getAdminProjectSubmissions(assessmentId: number) {
    const problem = await this.repo.findOneProblemByAssessmentId(assessmentId);
    if (!problem) return [];
    return this.repo.findSubmissionsByProblemIds([problem.id]);
  }

  async getAdminProjectResults(assessmentId: number) {
    const assessment = await this.repo.findAssessmentById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");
    const members = await this.repo.findAllMembersInRoom((assessment as any).roomId, true);
    const problem = await this.repo.findOneProblemByAssessmentId(assessmentId);
    if (!problem) return [];

    return Promise.all(
      members.map(async (memberItem) => {
        const member = (memberItem as any).user;
        const submission = await this.repo.findOneSubmission(problem.id, member.id);
        return { member, submission };
      })
    );
  }

  async saveProjectScore(assessmentId: number, userId: string, finalScore: number): Promise<Submission> {
    const problem = await this.repo.findOneProblemByAssessmentId(assessmentId);
    if (!problem) throw new Error("Problem for this assessment not found");

    const submission = await this.repo.findOneSubmission(problem.id, userId);
    if (!submission) throw new Error("No submission found for this user");

    submission.FinalScore = finalScore;
    return this.repo.save(submission);
  }

  async getUserProjectResults(assessmentId: number, userId: string) {
    const assessment = await this.repo.findAssessmentById(assessmentId);
    if (!assessment) throw new Error("Assessment not found");
    if (!assessment.resultpublished) return { published: false, results: [], result: null };

    const results = await this.getAdminProjectResults(assessmentId); // Re-use the admin logic for the leaderboard
    const problem = await this.repo.findOneProblemByAssessmentId(assessmentId);
    if (!problem) throw new Error("Problem not found");

    const userSubmission = await this.repo.findOneSubmission(problem.id, userId);
    return { published: true, results, result: userSubmission };
  }

  private async getAndSaveAIScore(submission: Submission, problemId: number, code: string, language: string) {
    try {
      const problem = await this.repo.findProblemById(problemId);
      if (!problem) return;

      const prompt = `You are an AI evaluator... Problem: ${problem.statement}\n Code: ${code}`;
      
      const generatedResponse = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
      });
      const responseText  = generatedResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
      let score;
      if(responseText){
        score = parseInt(responseText, 10);
      }else{
        score =0;
      }
      
      if (!isNaN(score)) {
        submission.AIscore = score;
        await this.repo.save(submission);
      }
    } catch (err) {
      console.error("Failed to get AI score:", err);
    }
  }
}