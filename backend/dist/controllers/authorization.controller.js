"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationController = void 0;
const authorization_service_1 = require("../services/authorization.service");
class AuthorizationController {
    constructor() {
        this.checkAccess = async (req, res) => {
            try {
                const { userId, roomId, assessmentId, problemId } = req.body;
                if (!userId) {
                    return res.status(401).json({ allowed: false, message: 'User ID is required for authorization.' });
                }
                let response;
                if (roomId) {
                    response = await this.service.checkRoomAccess(userId, roomId);
                }
                else if (assessmentId) {
                    response = await this.service.checkAssessmentAccess(userId, assessmentId);
                }
                else if (problemId) {
                    response = await this.service.checkProblemAccess(userId, problemId);
                }
                else {
                    return res.status(200).json({ allowed: true });
                }
                // } else {
                //   return res.status(400).json({ allowed: false, message: 'A resource ID (roomId, assessmentId, or problemId) is required.' });
                // }
                const status = response.allowed ? 200 : 403;
                return res.status(status).json(response);
            }
            catch (err) {
                return res.status(500).json({ allowed: false, message: err.message || 'An internal server error occurred.' });
            }
        };
        this.service = new authorization_service_1.AuthorizationService();
    }
}
exports.AuthorizationController = AuthorizationController;
