import { logger } from '../util';
import { listPipedriveDealsWorker } from './pipedrive.service';
import { insertBlingOrderWorker } from './bling.service';

const startWorkers = async () => {
  logger.info('Starting pipedrive worker...');
  listPipedriveDealsWorker.start();
  logger.info('Starting bling worker...');
  insertBlingOrderWorker.start();
}

export {
  startWorkers
}