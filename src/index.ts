import mongose from 'mongoose';
import { readFileSync } from 'fs';
import http = require('http');
import { logger } from './util/logger';
import { app } from './app';
import { startPipedriveWorker } from './services/pipedrive.service';
import { redis, startBlingWorker } from './services/bling.service';
import messages from './util/messages';
import { errors } from './util';
import { ErrorMessages } from './util/errors';
import { EnvType } from './types/common.types';
import { Integration } from './models';

const { PORT }: EnvType = process.env;

const startWorkers = async () => {
  logger.info(messages.STARTING_BLING_SERVICE);
  startPipedriveWorker();
  logger.info(messages.STARTING_PIPEDRIVE_SERVICE);
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
    logger.info(messages.MONGO_DATABASE_CONNECTION_SUCESSFULL);

    /* Remove all integration docs to start a clean integration*/
    await Integration.deleteMany({});
    /* Set all previous informations about integrations */
    await redis.set('next_start', 0);

    await startWorkers();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  logger.info(`${messages.HTTP_SERVER_STARTED} ${PORT}`);
});

start();
