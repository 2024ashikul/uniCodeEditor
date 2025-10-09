
import { db } from '../models'; // Your clean, refactored db object
import { LessonContent } from '../models/lessonContent.model';
import { LessonM } from '../models/lessonM.model';



// DTOs (Data Transfer Objects) for type safety
interface ContentDTO {
  type: 'text' | 'image' | 'video';
  content: string;
}

export class LessonRepository {
  async createLesson(data: { title: string, roomId: string }): Promise<LessonM> {
    return db.LessonM.create(data);
  }

  async createLessonContents(lessonId: number, contents: ContentDTO[]): Promise<LessonContent[]> {
    const contentsWithId = contents.map(c => ({ ...c, lessonId }));
    return db.LessonContent.bulkCreate(contentsWithId);
  }

  async findLessonById(id: number): Promise<LessonM | null> {
    return db.LessonM.findByPk(id);
  }
  
  async findLessonWithContent(id: number): Promise<LessonM | null> {
      return db.LessonM.findByPk(id, {
          include: [{ model: db.LessonContent, as: 'lessonContents' }] 
      });
  }

  async findAllByRoomId(roomId: string): Promise<LessonM[]> {
    return db.LessonM.findAll({ where: { roomId } });
  }

  async updateLesson(id: number, title: string): Promise<[number]> {
    return db.LessonM.update({ title }, { where: { id } });
  }

  async deleteLessonContents(lessonId: number): Promise<number> {
    return db.LessonContent.destroy({ where: { lessonId } });
  }

  async deleteLesson(id: number): Promise<number> {
    
    return db.LessonM.destroy({ where: { id } });
  }
}