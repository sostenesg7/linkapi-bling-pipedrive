import mongose from 'mongoose';
import http = require('http');
import { logger } from './util/logger';
import { app } from './app';
import { startPipedriveWorker } from './services/pipedrive.service';
import { redis, startBlingWorker } from './services/bling.service';
import { ErrorMessages } from './util/errors';
import { EnvType } from './types/common.types';
import { Integration } from './models';
import { startAutomaticConfiguration } from './services/configuration.service';
import { Messages } from './util/constants';

const { PORT }: EnvType = process.env;

const startWorkers = async () => {
  logger.info(Messages.STARTING_BLING_SERVICE);
  startPipedriveWorker();
  logger.info(Messages.STARTING_PIPEDRIVE_SERVICE);
  startBlingWorker();
}

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error(ErrorMessages.MONGO_URI_UNDEFINED);
  }

  if (!process.env.LOGGER_LEVEL) {
    throw new Error(ErrorMessages.LOGGER_LEVEL_UNDEFINED);
  }

  try {
    await mongose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    logger.info(Messages.MONGO_DATABASE_CONNECTION_SUCESSFULL);

    /* Remove all integration docs to start a clean integration*/
    await Integration.deleteMany({});
    /* Set all previous informations about integrations */
    await redis.set('next_start', 0);

    await startAutomaticConfiguration();

    await startWorkers();
  } catch (error) {
    logger.error(error);
    /* 
    * If some configuration is failed, kill node server to prevent
    * inconsistency. Service must be restarted
    */
    process.exit(-1);
    // throw error;
  }
};

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  logger.info(`${Messages.HTTP_SERVER_STARTED} ${PORT}`);
});

start();
