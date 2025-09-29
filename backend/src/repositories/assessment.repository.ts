import { db } from '../models'; 
import { Assessment } from '../models/assessment.model';


export interface IAssessmentRepository {
  findById(id: number): Promise<Assessment | null>;
  findAllByRoomId(roomId: string): Promise<Assessment[]>;
  findAllAssignedByRoomId(roomId: string): Promise<Assessment[]>;
  create(data: any): Promise<Assessment>;
  update(id: number, data: any): Promise<[number]>; 
  save(assessment: Assessment): Promise<Assessment>;
  createAnnouncement(data: any): Promise<any>;
}

export class AssessmentRepository implements IAssessmentRepository {
  async findById(id: number): Promise<Assessment | null> {
    return db.Assessment.findByPk(id);
  }

  async findAllByRoomId(roomId: string): Promise<Assessment[]> {
    return db.Assessment.findAll({ where: { roomId } });
  }

  async findAllAssignedByRoomId(roomId: string): Promise<Assessment[]> {
    return db.Assessment.findAll({ where: { roomId, status: 'assigned' } });
  }

  async create(data: any): Promise<Assessment> {
    return db.Assessment.create(data);
  }

  async update(id: number, data: any): Promise<[number]> {
    return db.Assessment.update(data, { where: { id } });
  }
  
  async save(assessment: Assessment): Promise<Assessment> {
    return assessment.save();
  }

  async createAnnouncement(data: any): Promise<any> {
    return db.Announcement.create(data);
  }
}