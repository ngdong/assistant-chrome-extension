import express, { Application } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import DB from '@/utils/db';
import logger from '@/utils/logger';
import morganMiddleware from '@/middlewares/logger.middleware';
import IController from '@/interfaces/controller.interface';
import {
  errorMiddleware,
  notFoundHandle,
} from '@/middlewares/error.middleware';
import rateLimiter from '@/middlewares/rateLimiter.middleware';

class App {
  public express: Application;
  public port: number;
  constructor(controllers: IController[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morganMiddleware);
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(rateLimiter);
  }

  private initialiseControllers(controllers: IController[]): void {
    this.express.get('/healthcheck', (_req, res) => {
      const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date(),
      };
      res.status(200).send(data);
    });
    controllers.forEach((controller: IController) => {
      this.express.use('/api/v1', controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(notFoundHandle);
    this.express.use(errorMiddleware);
  }

  private initialiseDatabaseConnection() {
    DB.initialize()
      .then(() => {
        logger.info('[database]: Data Source has been initialized!');
      })
      .catch((err) => {
        logger.error(
          '[database]: Error during Data Source initialization:',
          err,
        );
        process.exit(1);
      });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      logger.info(
        `[server]: Server is running at http://localhost:${this.port}`,
      );
    });
  }
}

export default App;
