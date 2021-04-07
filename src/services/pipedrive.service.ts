import { logger } from '../util';
import { EnvType } from '../types/common.types';
import Queue, { Job } from 'bull';
import ioredis from 'ioredis';
import { pipedriveAPI } from '../apis';
import { transformPipedriveDealToBlingOrder } from '../util/helpers';
import { blingQueue } from './bling.service';
import { ErrorMessages } from '../util/errors';
import messages from '../util/messages';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, PIPEDRIVE_API_KEY = '' }: EnvType = (process.env as any);

const redis = new ioredis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  logger.info(messages.PIPEDRIVE_REDIS_CONNECTED);
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

  try {

    const getWaitingCount = await blingQueue.getWaitingCount();

    if (getWaitingCount > 0) {
      //return;
    }

    /* Find next page saved from previous queue list integration job */
    const start = Number(await redis.get('next_start') || 0);

    const { data, additional_data } = await pipedriveAPI.list({
      apiToken: PIPEDRIVE_API_KEY,
      limit: 100,
      start,
    });

    const {
      next_start,
      more_items_in_collection
    } = additional_data.pagination;

    const orders = transformPipedriveDealToBlingOrder(data);

    /* If has more itens, set next_start to next job continue from next deals page */
    if (more_items_in_collection) {
      await redis.set('next_start', next_start);
    } else {
      await redis.set('next_start', 0);
    }

    /* const jobs = orders.map(order =>
      blingQueue.add({ order }, {
        attempts: 3,
        jobId: order.pipedriveDealId,
        //removeOnComplete: false,
        // removeOnFail: true,
      })
    ); */


    const jobs = orders.map(order => ({
      data: { order },
      opts: {
        jobId: order.pipedriveDealId,
        attempts: 3,
        /* Set removeOnComplete to false, to skip already inserted jobs to be processed */
        removeOnComplete: true,
        removeOnFail: true,
      }
    }) as Job);

    await blingQueue.addBulk(jobs);

    logger.info(`${orders.length} ${messages.PIPEDRIVE_DEALS_INSERTED_ON_QUEUE}`);
  } catch (reason) {
    logger.error(reason);
  }

}

/**
 * Start pipedrive queue worker
 *
 */
const startPipedriveWorker = async () => {

  await pipedriveQueue.empty();

  await pipedriveQueue.add('listDealsJob', {}, {
    jobId: 1,
    /* Repeate every 10 seconds */
    // repeat: { cron: '*/10 * * * * *', },
    /* Repeate every minute */
    repeat: { cron: '* * * * *', },
  });

  await pipedriveQueue.process('listDealsJob', 1, processDealsList);
};

export {
  pipedriveQueue,
  redis,
  startPipedriveWorker,
}
