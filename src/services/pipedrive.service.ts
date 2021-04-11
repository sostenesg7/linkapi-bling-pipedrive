import { logger } from '../util';
import { EnvType } from '../types/common.types';
import Queue, { Job } from 'bull';
import ioredis from 'ioredis';
import { pipedriveAPI } from '../apis';
import { transformOrdersToJobs, transformPipedriveDealToBlingOrder } from '../util/helpers';
import { blingQueue } from './bling.service';
import { ErrorMessages } from '../util/errors';
import { DEALS_FILTER_REDIS_KEY, Messages } from '../util/constants';
import { getDealsSummary } from '../apis/pipedrive.api';
import { Summary } from '../models';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, PIPEDRIVE_API_KEY = '' } = process.env as EnvType;

const redis = new ioredis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  logger.info(Messages.PIPEDRIVE_REDIS_CONNECTED);
});

redis.on('error', () => {
  logger.error(ErrorMessages.PIPEDRIVE_REDIS_ERROR);
});

const pipedriveQueue = new Queue('pipedrive', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
  limiter: {
    max: 1,
    duration: 1000
  }
});

/**
 * Process a deal list from pipedrive
 * inserting any deal as a job
 *
 * @param {Queue.Job<any>} job
 */
const processDealsList: Queue.ProcessCallbackFunction<any> = async (job: Queue.Job<any>) => {

  await startIntegration();

}

/**
 * Start pipedrive queue worker
 *
 */
const startPipedriveWorker = async () => {

  await pipedriveQueue.empty();

  await pipedriveQueue.add('listDealsJob', {}, {
    jobId: 1,
    /*
    * Repeate every 1 minute to inprove integration speed in development
    *
    */
    repeat: { cron: '* * * * *', },
  });

  await pipedriveQueue.process('listDealsJob', 1, processDealsList);
};

/**
 * Start deals integration
 * used in both manual and automatic integrations
 *
 * @return {*} 
 */
const startIntegration = async () => {
  try {
    logger.info(Messages.STARTING_NEW_INTEGRATION);
    /* Find next page saved from previous queue list integration job */
    const start = Number(await redis.get('next_start') || 0);

    const filterId = Number(await redis.get(DEALS_FILTER_REDIS_KEY));

    /* Get deals summary of current day and store */
    const summary = await getDealsSummary({
      filterId,
      apiToken: PIPEDRIVE_API_KEY
    });

    await Summary.findOneAndUpdate({
      date: new Date().toISOString().split('T')[0]
    }, {
      $inc: {
        total: summary.data.total_currency_converted_value
      }
    }, { upsert: true });

    const { data, additional_data } = await pipedriveAPI.list({
      apiToken: PIPEDRIVE_API_KEY,
      /* Fetch 20 deals per job */
      limit: 20,
      start,
    });

    const {
      next_start,
      more_items_in_collection
    } = additional_data.pagination;

    const orders = transformPipedriveDealToBlingOrder(data);

    /* If has more itens, set next_start to next job continue from next deals page */
    await redis.set('next_start', more_items_in_collection ? next_start : 0);

    /* Create bling order insertion jobs */
    const jobs = transformOrdersToJobs(orders);

    await blingQueue.addBulk(jobs);

    const message = `${orders.length} ${Messages.PIPEDRIVE_DEALS_INSERTED_ON_QUEUE}`;
    logger.info(message);
    return message;
  } catch (reason) {
    logger.error(reason);
  }
}

export {
  pipedriveQueue,
  redis,
  startPipedriveWorker,
  startIntegration
}
