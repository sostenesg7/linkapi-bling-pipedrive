import { logger } from '../util';
import { EnvType } from '../types/common.types';
import Queue from 'bull';
import ioredis from 'ioredis';
import { blingAPI } from '../apis';
import { Order } from '../types/bling.types';
import { listDealProducts } from '../apis/pipedrive.api';
import { transformPipedriveProductToBlingItem } from '../util/helpers';
import { ErrorCodes, ErrorMessages } from '../util/errors';
import { Integration } from '../models';
import messages from '../util/messages';
import { pipedriveQueue } from './pipedrive.service';

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  BLING_API_KEY = '',
  PIPEDRIVE_API_KEY = ''
}: EnvType = (process.env as any);

const redis = new ioredis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  logger.info(messages.BLING_REDIS_CONNECTED);
});

redis.on('error', () => {
  logger.info(ErrorMessages.BLING_REDIS_ERROR);
});

const blingQueue = new Queue('bling', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
  /*
  * Limit concurrent jobs to 1 per second
  * to prevent rate limit from bling
  * and total per day document update concurrency problem
  * bling rate limit is 3 requests per second and 30.000 per day
  */
  limiter: {
    max: 1,
    duration: 1000
  }
});

/* the queue has processed all the waiting jobs */
blingQueue.on('drained', () => {
  /* Resume pipedrive queue to start new integrations */
  // pipedriveQueue.resume();
  // logger.info('Resuming pipedrive queue.');
});

/* A job has started. */
blingQueue.on('active', () => {
  /* Pause pipedrive queue to wait until all integrations are completed */
  // pipedriveQueue.pause();
  // logger.info('Pausing pipedrive queue.');
});

/**
 * Process a deal from orders list, insering on bling service
 * and increasing the total per day of all orders
 *
 * @param {Queue.Job<{ order: Order }>} job
 */
const processDeal: Queue.ProcessCallbackFunction<any> = async (job: Queue.Job<{ order: Order }>) => {

  try {
    const { order } = job.data;

    /* Find deal products  */
    const dealProductsData = await listDealProducts({
      dealId: order.pipedriveDealId,
      apiToken: PIPEDRIVE_API_KEY
    });

    order.itens = transformPipedriveProductToBlingItem(dealProductsData.data);

    /* Insert an order on bling service */
    const data = await blingAPI.createOrder({
      apiKey: BLING_API_KEY,
      order,
    });

    const errors = data.retorno.erros;

    if (Array.isArray(errors) && errors.length > 0) {
      const error = errors?.[0]?.erro.msg
      logger.error(error);

      /*
      * If has some error and the error is not order already exists
      * throw an error, preventing job to be removed from queue
      * If job attemps = 3 will be automatically removed from queue
      */
      if (!errors.find(error => error?.erro?.cod === ErrorCodes.ORDER_ALREADY_EXISTS)) {
        throw new Error(error);
      }
      /* 
       * Return if some error is product already registered
      */
      return;
    }

    /* Update the total per day of all orders integrated */
    await Integration.findOneAndUpdate({
      date: order.pipedriveCreatedAt.split(' ')[0]
    }, {
      $inc: {
        total: order.total
      }
    }, { upsert: true });

    const orderId = data.retorno.pedidos?.[0]?.pedido?.idPedido;

    logger.info(`${messages.BLING_ORDER_CREATED} (${orderId})`);

  } catch (reason) {
    // logger.error(reason);
  }
}

/**
 * Start bling queue worker
 *
 */
const startBlingWorker = async () => {
  // await blingQueue.empty();
  await blingQueue.process(processDeal);
};

export {
  blingQueue,
  redis,
  startBlingWorker,
}
