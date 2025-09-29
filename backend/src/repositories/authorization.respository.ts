import { db } from '../models';

import { Assessment } from '../models/assessment.model';
import { Problem } from '../models/problem.model';
import { Room } from '../models/room.model';
import { RoomMember } from '../models/roommember.model';

export class AuthorizationRepository {
  
  async findRoomMembership(userId: string, roomId: number): Promise<RoomMember | null> {
    return db.RoomMember.findOne({
      where: { userId, roomId },
      include: [{ model: db.Room, as: 'room', attributes: ['name'] }]
    });
  }

  
  async findAssessmentById(assessmentId: number): Promise<Assessment | null> {
    return db.Assessment.findByPk(assessmentId);
  }

  
  async findProblemById(problemId: number): Promise<Problem | null> {
    return db.Problem.findByPk(problemId);
  }
}