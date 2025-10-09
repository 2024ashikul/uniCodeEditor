import { Request, Response } from 'express';
import { LessonService } from '../services/lesson.service';

export class LessonController {
  private service: LessonService;

  constructor() {
    this.service = new LessonService();
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { contents, title, roomId } = req.body;
      await this.service.createLesson(title, roomId, contents);
      return res.status(201).json({ message: 'Created a new lesson' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Could not create lesson' });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { contents, title, lessonId } = req.body;
      await this.service.updateLesson(lessonId, title, contents);
      return res.status(200).json({ message: "Lesson updated successfully" });
    } catch (err: any) {
      if (err.message === "Lesson not found") {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message || 'Could not update lesson' });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { lessonId } = req.body;
      await this.service.deleteLesson(lessonId);
      return res.status(200).json({ message: 'Deleted the lesson successfully' });
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({ message: err.message });
      }
      return res.status(500).json({ message: err.message });
    }
  };
  
  fetchOne = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { lessonId } = req.body;
          const lesson = await this.service.getLessonWithContent(lessonId);
          
          if (!lesson) {
              return res.status(404).json({ message: "Lesson not found" });
          }
          return res.status(200).json({ lesson });
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };
  
  fetchAll = async (req: Request, res: Response): Promise<Response> => {
      try {
          const { roomId } = req.body;
          const lessons = await this.service.getAllLessonsForRoom(roomId);
          return res.status(200).json({ message: 'Fetched lessons', lessons });
      } catch (err: any) {
          return res.status(500).json({ message: err.message });
      }
  };
}