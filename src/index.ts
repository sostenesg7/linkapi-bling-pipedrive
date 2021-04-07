import mongose from 'mongoose';
import { readFileSync } from 'fs';
import http = require('http');
import { logger } from './util/logger';
import { app } from './app';
import { startWorkers } from './services/integration.service';

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined.');
  }

  if (!process.env.LOGGER_LEVEL) {
    throw new Error('LOGGER_LEVEL must be defined');
  }

  try {
    await mongose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    logger.info('Database connection successfull.');

    await startWorkers();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const httpServer = http.createServer(app);

httpServer.listen(3000, () => {
  logger.info('HTTP Server running on port 3000');
});

start();
