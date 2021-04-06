import { blingAPI, pipedriveAPI } from '../apis'
import { logger } from '../util';
import cron from 'node-cron';
import { ErrorCodes } from '../util/errors';
import { listDealProducts } from '../apis/pipedrive.api';
import { Queue, Resume, Integration } from '../models';
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

    const integrationDoc = await Integration.findOne({});

    /* Find last queued page */
    const start = integrationDoc?.lastPipedriveDealsPage || 0;
    const integratedDealsCount = integrationDoc?.integratedDealsCount || 0;

    const { data, additional_data } = await pipedriveAPI.list({
      apiToken,
      limit: 100,
      start
    });

    /* Filter deals on current page based on previous integration */
    const notInsertedDealsFromCurrentPage = data.slice(integratedDealsCount);
    const orders = transformPipedriveDealToBlingOrder(notInsertedDealsFromCurrentPage);

    await Queue.insertMany(orders);

    // const lastPipedriveDealId = data[data.length - 1]?.id || 0;

    await Integration.updateOne({}, {
      $set: {
        /* Save last queued page to skip previous inserted deals */
        lastPipedriveDealsPage: additional_data.pagination.next_start || 0,
        /* Save the total of queued deals in last page to skip previous inserted deals */
        integratedDealsCount: data.length
      }
    }, { upsert: true });

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

const startWorkers = async () => {

  logger.info('Starting pipedrive worker...');
  listPipedriveDealsWorker.start();
  logger.info('Starting bling worker...');
  insertBlingOrderWorker.start();
}

export {
  startWorkers
}