import { Request, Response } from 'express';
import { RoomService } from '../services/room.service';

export class RoomController {
  private service: RoomService;

  constructor() {
    this.service = new RoomService();
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, roomName } = req.body;
      const newRoom = await this.service.createRoom(userId, roomName);
      return res.status(201).json({ message: 'Created a new room!', newRoom });
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Internal server error' });
    }
  };

  join = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId, roomId } = req.body;
      const room = await this.service.joinRoom(userId, roomId);
      return res.status(201).json({ message: 'Joined the room', Room: room });
    } catch (err: any) {
      if (err.message === 'Room not found') {
        return res.status(404).json({ message: err.message, type: 'warning' });
      }
      if (err.message === 'You have already joined this room') {
        return res.status(409).json({ message: err.message, type: 'warning' }); // 409 Conflict is more appropriate
      }
      return res.status(500).json({ message: err.message });
    }
  };

  roomsJoined = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.body;
      const rooms = await this.service.getJoinedRooms(userId);
      return res.status(200).json({ rooms });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  members = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId } = req.body;
      const members = await this.service.getRoomMembers(roomId);
      return res.status(200).json(members);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  getAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId } = req.body;
      const room = await this.service.getRoomAdmin(roomId);
      if (!room) return res.status(404).json({ message: 'Room not found' });
      return res.status(200).json({ admin: room.admin, name: room.name });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  changeAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId, memberToAdmin } = req.body;
      await this.service.toggleAdminRole(memberToAdmin, roomId);
      return res.status(200).json({ message: 'Permission Updated' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };

  kickmember = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { roomId, memberToKick } = req.body;
      await this.service.kickMember(memberToKick, roomId);
      return res.status(200).json({ message: 'Member has been Removed!' });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  };
  
 
}