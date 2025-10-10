import http from 'http';
import app, { ideProxy } from './app';
import { DatabaseService } from './services/DatabaseServices';
import { SocketService } from './services/socketServices';
import { env } from './config/environment';
import { Socket } from 'net';

import dotenv from 'dotenv';
dotenv.config();

class Application {
  private readonly databaseService: DatabaseService;
  private readonly socketService: SocketService;
  private readonly server: http.Server;

  constructor() {
    this.databaseService = new DatabaseService();
    this.server = http.createServer(app);


    this.socketService = new SocketService(this.server);
  }

  public async start(): Promise<void> {
    try {
      console.log('Booting up the application...');
      await this.databaseService.connect();
      //  socket handlers can be registered here if  needed to
      // this.socketService.registerHandlers();
      this.server.on('upgrade', (req, socket : Socket, head) => {
        ideProxy.upgrade(req, socket, head);
      });

      this.server.listen(env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      });

    } catch (error) {
      console.error('💥 Application failed to start:', error);
      process.exit(1);
    }
  }
}

const application = new Application();
application.start();