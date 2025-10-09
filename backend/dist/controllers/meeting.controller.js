"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingController = void 0;
const meeting_service_1 = require("../services/meeting.service");
class MeetingController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { roomId, userId, type } = req.body;
                await this.service.createMeeting(roomId, userId, type);
                return res.status(201).json({ message: 'New meeting created' });
            }
            catch (err) {
                if (err.message.includes('already active')) {
                    return res.status(409).json({ message: err.message }); // 409 Conflict
                }
                return res.status(500).json({ message: err.message || 'Internal server error!' });
            }
        };
        this.leave = async (req, res) => {
            try {
                const { roomId, type } = req.body;
                await this.service.leaveMeeting(roomId, type);
                return res.status(200).json({ message: 'Ended the meeting successfully!' });
            }
            catch (err) {
                if (err.message === 'Active meeting not found') {
                    return res.status(404).json({ message: err.message });
                }
                return res.status(500).json({ message: err.message });
            }
        };
        this.getMeetingStatus = async (req, res) => {
            try {
                const { userId } = req.body;
                const meetings = await this.service.getActiveMeetingsForUser(userId);
                return res.status(200).json({ meetings });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.getMeetingUser = async (req, res) => {
            try {
                const { roomId } = req.body;
                const meetings = await this.service.getActiveMeetingsInRoom(roomId);
                return res.status(200).json({ meetings });
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.getMeetingStatusRoom = async (req, res) => {
            try {
                const { roomId } = req.body;
                const status = await this.service.getRoomMeetingStatus(roomId);
                return res.status(200).json(status);
            }
            catch (err) {
                return res.status(500).json({ message: err.message });
            }
        };
        this.service = new meeting_service_1.MeetingService();
    }
}
exports.MeetingController = MeetingController;
