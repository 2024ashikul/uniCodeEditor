"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const room_service_1 = require("../services/room.service");
class RoomController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { userId, roomName } = req.body;
                const newRoom = await this.service.createRoom(userId, roomName);
                return res.status(201).json({ message: 'Created a new room!', newRoom });
            }
            catch (err) {
                return res.status(500).json({ message: err.message || 'Internal server error' });
            }
        };
        this.join = async (req, res) => {
            try {
                const { userId, roomId } = req.body;
                const room = await this.service.joinRoom(userId, roomId);
                return res.status(201).json({ message: 'Joined the room', Room: room });
            }
            catch (err) {
                if (err.message === 'Room not found') {
                    return res.status(404).json({ message: err.message, type: 'warning' });
                }
                if (err.message === 'You have already joined this room') {
                    return res.status(409).json({ message: err.message, type: 'warning' }); // 409 Conflict is more appropriate
                }
                return res.status(500).json({ message: err.message });
            }
        };
        this.roomsJoined = async (req, res) => {
            try {
                const { userId } = req.body;
                const rooms = await this.service.getJoinedRooms(userId);
                return res.status(200).json({ rooms });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.members = async (req, res) => {
            try {
                const { roomId } = req.body;
                const members = await this.service.getRoomMembers(roomId);
                return res.status(200).json(members);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.getAdmin = async (req, res) => {
            try {
                const { roomId } = req.body;
                const room = await this.service.getRoomAdmin(roomId);
                if (!room)
                    return res.status(404).json({ message: 'Room not found' });
                return res.status(200).json({ admin: room.admin, name: room.name });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.changeAdmin = async (req, res) => {
            try {
                const { roomId, memberToAdmin } = req.body;
                await this.service.toggleAdminRole(memberToAdmin, roomId);
                return res.status(200).json({ message: 'Permission Updated' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.kickmember = async (req, res) => {
            try {
                const { roomId, memberToKick } = req.body;
                await this.service.kickMember(memberToKick, roomId);
                return res.status(200).json({ message: 'Member has been Removed!' });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.service = new room_service_1.RoomService();
    }
}
exports.RoomController = RoomController;
