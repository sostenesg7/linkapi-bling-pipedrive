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
import mongoose, { Types } from 'mongoose';


const apiToken = 'b51865d76db88d36e9d37b362c04cc0ea7900649';

// second: * * * * * *
// minute: * * * * *

/* Every minute */
export const listPipedriveDealsWorker = cron.schedule('* * * * *', async () => {
  logger.info('Listering for pipedrive deals...');

  try {

    const integrationDoc = await Integration.findOne({});

    /* Find last queued page */
    const start = integrationDoc?.nextPipedriveDealsPage || 0;

    const { data, additional_data } = await pipedriveAPI.list({
      apiToken,
      limit: 5,
      start
    });

    // let lastIntegratedPageDealsCount = integrationDoc?.lastIntegratedPageDealsCount || 0;
    // let notInsertedDealsFromCurrentPage = data;

    /* If is last page, filter deals on current page based on previous integration */
    /* if (!additional_data.pagination.more_items_in_collection) {
      notInsertedDealsFromCurrentPage = data.slice(lastIntegratedPageDealsCount);
      lastIntegratedPageDealsCount = 0;
    } else {
      lastIntegratedPageDealsCount = data.length;
    } */

    const orders = transformPipedriveDealToBlingOrder(data);

    await Queue.insertMany(orders);

    // const lastPipedriveDealId = data[data.length - 1]?.id || 0;

    await Integration.updateOne({}, {
      $set: {
        /* Save last queued page to skip previous inserted deals */
        nextPipedriveDealsPage: Math.max(additional_data.pagination.next_start || 0, start),
        /* Save the total of queued deals in last page to skip previous inserted deals */
        // lastIntegratedPageDealsCount,
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
