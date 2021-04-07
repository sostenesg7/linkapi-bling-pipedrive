import { logger } from '../util';
import { startPipedriveWorker } from './pipedrive.service';
import { startBlingWorker } from './bling.service';

const startWorkers = async () => {
  logger.info('Starting pipedrive worker...');
  startPipedriveWorker();
  logger.info('Starting bling worker...');
  startBlingWorker();
}

export {
  startWorkers
}