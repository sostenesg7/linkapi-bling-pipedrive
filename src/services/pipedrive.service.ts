import { logger } from '../util';
import { EnvType } from '../types/common.types';
import Queue from 'bull';
import ioredis from 'ioredis';
import { pipedriveAPI } from '../apis';
import { transformPipedriveDealToBlingOrder } from '../util/helpers';
import { blingQueue } from './bling.service';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, PIPEDRIVE_API_KEY }: EnvType = (process.env as any);

const redis = new ioredis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  logger.info('PIPEDRIVE REDIS CONNECTED');
});

redis.on('error', () => {
  logger.info('PIPEDRIVE REDIS ERROR:');
});

const pipedriveQueue = new Queue('pipedrive', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
  limiter: {
    max: 2,
    duration: 1000
  }
});

const processDealsList: Queue.ProcessCallbackFunction<any> = async (job: Queue.Job<any>) => {

  try {

    /* Find next page saved from previous queue list integration job */
    const start = Number(await redis.get('next_start') || 0);

    logger.info(`next_start: ${start}`);

    const { data, additional_data } = await pipedriveAPI.list({
      apiToken: PIPEDRIVE_API_KEY,
      limit: 5,
      start,
    });

    const {
      next_start,
      more_items_in_collection
    } = additional_data.pagination;

    const orders = transformPipedriveDealToBlingOrder(data);

    if (more_items_in_collection) {
      await redis.set('next_start', next_start);
    } else {
      await redis.set('next_start', 0);
    }

    const promises = orders.map(order => blingQueue.add({ order }, {
      attempts: 3,
      removeOnComplete: true,
    }));

    await Promise.all(promises);

    logger.info(`${orders.length} orders inserted in queue`)
  } catch (reason) {
    logger.error(reason);
  }

}

const startPipedriveWorker = async () => {

  await pipedriveQueue.empty();

  await pipedriveQueue.add('listDealsJob', {}, {
    jobId: 1,
    /* Repeate every 10 seconds */
    repeat: { cron: '*/10 * * * * *', },
  });

  await pipedriveQueue.process('listDealsJob', 1, processDealsList);
};

export {
  pipedriveQueue,
  redis,
  startPipedriveWorker,
}
