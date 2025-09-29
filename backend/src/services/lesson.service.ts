import { LessonM } from '../models/lessonM.model';
import { LessonRepository } from '../repositories/lesson.repository';


interface ContentDTO {
  type: 'text' | 'image' | 'video';
  content: string;
}

export class LessonService {
  private lessonRepo: LessonRepository;

  constructor() {
    this.lessonRepo = new LessonRepository();
  }

  async createLesson(title: string, roomId: string, contents: ContentDTO[]): Promise<LessonM> {
    // Business Logic: A lesson and its content are created together.
    const newLesson = await this.lessonRepo.createLesson({ title, roomId });
    if (contents && contents.length > 0) {
      await this.lessonRepo.createLessonContents(newLesson.id, contents);
    }
    return newLesson;
  }

  async updateLesson(lessonId: number, title: string, contents: ContentDTO[]): Promise<LessonM> {
    const lesson = await this.lessonRepo.findLessonById(lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Business Logic: Update the title and replace the entire content block.
    await this.lessonRepo.updateLesson(lessonId, title);
    await this.lessonRepo.deleteLessonContents(lessonId); // Delete old content
    await this.lessonRepo.createLessonContents(lessonId, contents); // Add new content

    const updatedLesson = await this.lessonRepo.findLessonWithContent(lessonId);
    if (!updatedLesson) throw new Error("Could not retrieve updated lesson");
    
    return updatedLesson;
  }

  async deleteLesson(lessonId: number): Promise<void> {
    const deletedCount = await this.lessonRepo.deleteLesson(lessonId);
    if (deletedCount === 0) {
      throw new Error("Lesson not found or already deleted");
    }
  }

  async getLessonWithContent(lessonId: number): Promise<LessonM | null> {
    return this.lessonRepo.findLessonWithContent(lessonId);
  }

  async getAllLessonsForRoom(roomId: string): Promise<LessonM[]> {
    return this.lessonRepo.findAllByRoomId(roomId);
  }
}