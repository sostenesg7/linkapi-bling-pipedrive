import { logger } from '../util';
import { EnvType } from '../types/common.types';
import Queue from 'bull';
import ioredis from 'ioredis';
import { blingAPI } from '../apis';
import { Order } from '../types/bling.types';
import { listDealProducts } from '../apis/pipedrive.api';
import { transformPipedriveProductToBlingItem } from '../util/helpers';
import { ErrorCodes } from '../util/errors';
import { Integration } from '../models';

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  BLING_API_KEY,
  PIPEDRIVE_API_KEY
}: EnvType = (process.env as any);

const redis = new ioredis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  logger.info('BLING REDIS CONNECTED');
});

redis.on('error', () => {
  logger.info('BLING REDIS ERROR');
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

blingQueue.on('drained', () => {
  logger.info('Waiting for new orders...');
});

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
       * Return if some error is product already registered 
       * and remove order from queue     
      */
      if (!errors.find(error => error?.erro?.cod === ErrorCodes.ORDER_ALREADY_EXISTS)) {
        throw new Error(error);
      }
      return
    }

    await Integration.findOneAndUpdate({
      date: order.pipedriveCreatedAt.split(' ')[0]
    }, {
      $inc: {
        total: order.total
      }
    }, { upsert: true });

    logger.info(`Order created ${data.retorno.pedidos?.[0]?.pedido?.idPedido}`);

  } catch (reason) {
    logger.error(reason);
  }
}

const startBlingWorker = async () => {
  // await blingQueue.empty();
  await blingQueue.process(processDeal);
};

export {
  blingQueue,
  redis,
  startBlingWorker,
}
