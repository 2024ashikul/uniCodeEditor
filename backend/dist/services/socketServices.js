"use strict";
// services/socketServices.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
class SocketService {
    constructor(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*', // has to be more specific in production!
                methods: ['GET', 'POST'],
            },
        });
        console.log('🔌 Socket.IO service initialized and attached to the HTTP server.');
    }
    registerHandlers() {
        console.log('🔌 Registering Socket.IO namespaces and handlers...');
        //  handlers go here...
        console.log('✅ All Socket.IO handlers registered.');
    }
}
exports.SocketService = SocketService;
