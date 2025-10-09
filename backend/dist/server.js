"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importStar(require("./app"));
const DatabaseServices_1 = require("./services/DatabaseServices");
const socketServices_1 = require("./services/socketServices");
const environment_1 = require("./config/environment");
class Application {
    constructor() {
        this.databaseService = new DatabaseServices_1.DatabaseService();
        this.server = http_1.default.createServer(app_1.default);
        this.socketService = new socketServices_1.SocketService(this.server);
    }
    async start() {
        try {
            console.log('Booting up the application...');
            await this.databaseService.connect();
            //  socket handlers can be registered here if  needed to
            // this.socketService.registerHandlers();
            this.server.on('upgrade', (req, socket, head) => {
                app_1.ideProxy.upgrade(req, socket, head);
            });
            this.server.listen(environment_1.env.PORT, () => {
                console.log(`🚀 Server running on http://localhost:${environment_1.env.PORT}`);
            });
        }
        catch (error) {
            console.error('💥 Application failed to start:', error);
            process.exit(1);
        }
    }
}
const application = new Application();
application.start();
