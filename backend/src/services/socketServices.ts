import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer, Namespace } from 'socket.io';
import { Application as ExpressApp } from 'express';

//  convert  handler files to TS and import
// import { registerCollaborateHandlers } from '../sockets/collaborate'; 
// ... and so on for other handlers


export class SocketService {
  private io: SocketIOServer;
  public readonly httpServer: HttpServer;

  constructor(app: ExpressApp) {
    this.httpServer = createServer(app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: '*', // Be more specific in production!
        methods: ['GET', 'POST'],
      },
    });
  }

  public listen(port: number): void {
    this.httpServer.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  }

  public registerHandlers(): void {
    console.log('🔌 Registering Socket.IO namespaces and handlers...');
    
    
    // const collaborate: Namespace = this.io.of('/collaborate');
    // registerCollaborateHandlers(collaborate);
    
    // Register all handlers here...
    // const collaborateClass: Namespace = this.io.of('/collaborateClass');
    // registerCollaborateClassHandlers(collaborateClass);
    
    console.log('✅ All Socket.IO handlers registered.');
  }
}