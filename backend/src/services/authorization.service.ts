import { AuthorizationRepository } from "../repositories/authorization.respository";



// Define a consistent structure for our authorization response.
interface AccessResponse {
  allowed: boolean;
  message: string;
  role?: 'admin' | 'member';
  details?: object;
}

export class AuthorizationService {
  private authRepo: AuthorizationRepository;

  constructor() {
    this.authRepo = new AuthorizationRepository();
  }

  
  async checkRoomAccess(userId: string, roomId: number): Promise<AccessResponse> {
    const membership = await this.authRepo.findRoomMembership(userId, roomId);

    if (membership) {
      return {
        allowed: true,
        message: 'Access granted to room.',
        role: membership.role,
        details: { name: (membership as any).room.name }
      };
    }

    return { allowed: false, message: 'User is not a member of this room.' };
  }

 
  async checkAssessmentAccess(userId: string, assessmentId: number): Promise<AccessResponse> {
    const assessment = await this.authRepo.findAssessmentById(assessmentId);
    if (!assessment) {
      return { allowed: false, message: 'Assessment not found.' };
    }

    const roomAccess = await this.checkRoomAccess(userId, (assessment as any).roomId);

    if (roomAccess.allowed) {
     
      roomAccess.details = {
        ...roomAccess.details,
        type: assessment.category,
        scheduleTime: assessment.scheduleTime,
        duration: assessment.duration,
        status: assessment.status,
        title: assessment.title
      };
      return roomAccess;
    }

    return { allowed: false, message: 'User does not have access to the assessment\'s room.' };
  }

  
  async checkProblemAccess(userId: string, problemId: number): Promise<AccessResponse> {
    const problem = await this.authRepo.findProblemById(problemId);
    if (!problem) {
      return { allowed: false, message: 'Problem not found.' };
    }

    
    return this.checkAssessmentAccess(userId, (problem as any).assessmentId);
  }
}