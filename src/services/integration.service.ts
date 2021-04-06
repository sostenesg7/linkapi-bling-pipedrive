import { blingAPI, pipedriveAPI } from '../apis'
import { logger } from '../util';
import cron from 'node-cron';
import { ErrorCodes } from '../util/errors';
import { listDealProducts } from '../apis/pipedrive.api';
import Queue from '../models/queue.model';
import {
  transformPipedriveDealToBlingOrder,
  transformPipedriveProductToBlingItem
} from '../util/helpers';

const apiToken = 'b51865d76db88d36e9d37b362c04cc0ea7900649';

// second: * * * * * *
// minute: * * * * *

/* Every minute */
const listPipedriveDealsWorker = cron.schedule('* * * * *', async () => {
  logger.info('Listering for pipedrive deals...');

  try {

    const listData = await pipedriveAPI.list({
      apiToken,
      limit: 100
    });

    const orders = transformPipedriveDealToBlingOrder(listData.data);

    await Queue.insertMany(orders);

    logger.info(`${orders.length} orders inserted in queue`)
  } catch (reason) {
    logger.error(reason);
  }

}, {
  scheduled: false,
  timezone: 'America/Sao_Paulo'
});

/* Every second */
const insertBlingOrderWorker = cron.schedule('* * * * * *', async () => {
  logger.info('Listering for new orders...');

  try {

    /* Find first inserted deal in queue list */
    const orderDoc = await Queue.findOne({}).sort({ _id: -1 });

    /* Return if hasn't document in queue */
    if (!orderDoc) return;

    const order = orderDoc.toObject();

    delete order.id;
    delete order.createdAt;
    delete order._id;
    delete order.updatedAt;

    /* Find deal products  */
    const dealProductsData = await listDealProducts({
      dealId: order.pipedriveDealId,
      apiToken
    });

    order.itens = transformPipedriveProductToBlingItem(dealProductsData.data);

    /* Insert an order on bling service */
    const data = await blingAPI.createOrder({
      apiKey:
        '72fc8fab18ef3e077a0adbdd13125e089e997785206751f49fbca9ca48248821b97b9b86',
      order,
    });

    const errors = data.retorno.erros;

    if (Array.isArray(errors) && errors.length > 0) {
      logger.error(errors?.[0]?.erro.msg);
      
      /* 
        Return if some error is product already registered 
        and remove order from queue     
      */
      if (errors.find(error => error?.erro?.cod === ErrorCodes.ORDER_ALREADY_EXISTS)) {
        logger.info(`Removing already registered order ${order.pipedriveDealId} from queue...`)
        await orderDoc.remove();
        return;
      }
    }

    logger.info(`Order created ${data.retorno.pedidos?.[0]?.pedido?.idPedido}`);

    /* If sucessfull delete the current document from queue */
    await orderDoc.remove();
    logger.info(`Removing ${order.pipedriveDealId} from queue...`);

  } catch (reason) {
    logger.error(JSON.stringify(reason, null, 2));
  }

}, {
  scheduled: false,
  timezone: 'America/Sao_Paulo'
});

const startWorker = () => {
  logger.info('Starting pipedrive worker...');
  listPipedriveDealsWorker.start();
  logger.info('Starting bling worker...');
  insertBlingOrderWorker.start();
}

export {
  startWorker
}