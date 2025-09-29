
import app from './app';
import { env } from './config/environment';
import { DatabaseService } from './services/DatabaseServices';
import { SocketService } from './services/socketServices';


class Application {
  private readonly databaseService: DatabaseService;
  private readonly socketService: SocketService;

  constructor() {
    this.databaseService = new DatabaseService();
    this.socketService = new SocketService(app);
  }

  public async start(): Promise<void> {
    try {
      console.log('Booting up the application...');
      await this.databaseService.connect();
      this.socketService.registerHandlers();
      this.socketService.listen(env.PORT);
    } catch (error) {
      console.error('💥 Application failed to start:', error);
      process.exit(1);
    }
  }
}


const application = new Application();
application.start();