import { pipedriveAPI } from '../apis'
import { logger } from '../util';

const RATE_LIMIT = 3; // 3 request per second
const INSERT_INTERVAL = 1000 / RATE_LIMIT; // Calculate insert interval based on rate limit

/* 
  Bling rate limit: https://ajuda.bling.com.br/hc/pt-br/articles/360046302394-Limites
  Bling only support 3 request per second and 30.000 requests per day
  if the api rate limit is reached the request will return 429 status (too many requests)
*/
const startIntegration = async () => {

  try {
    const { additional_data: atitionalData, data, success } = await pipedriveAPI.list({
      apiToken: 'b51865d76db88d36e9d37b362c04cc0ea7900649'
    });

    const promises = [];

    const createOrderInterval = setInterval(() => {
      
    }, INSERT_INTERVAL);


  } catch (reason) {
    logger.error(reason);
  }


}

export {
  startIntegration
}