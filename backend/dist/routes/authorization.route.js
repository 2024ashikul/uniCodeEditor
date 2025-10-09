"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorization_controller_1 = require("../controllers/authorization.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authController = new authorization_controller_1.AuthorizationController();
const router = (0, express_1.Router)();
router.post('/check-access', authMiddleware_1.authenticateToken, authController.checkAccess);
exports.default = router;
