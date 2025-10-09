// services/socketServices.ts

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';


export class SocketService {
  private io: SocketIOServer;

  constructor(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*', // has to be more specific in production!
        methods: ['GET', 'POST'],
      },
    });
    console.log('🔌 Socket.IO service initialized and attached to the HTTP server.');
  }


  public registerHandlers(): void {
    console.log('🔌 Registering Socket.IO namespaces and handlers...');
    //  handlers go here...
    console.log('✅ All Socket.IO handlers registered.');
  }
}