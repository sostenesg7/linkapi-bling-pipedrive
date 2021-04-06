import { blingAPI, pipedriveAPI } from '../apis'
import { logger } from '../util';
import cron from 'node-cron';
import { createOrder } from '../apis/bling.api';
import { Order } from '../types/bling.types';
import { ErrorCodes } from '../util/errors';
import { listDealProducts } from '../apis/pipedrive.api';
import faker from 'faker';

const apiToken = 'b51865d76db88d36e9d37b362c04cc0ea7900649';

const RATE_LIMIT = 3; // 3 request per second
const INSERT_INTERVAL = 1000 / RATE_LIMIT; // Calculate insert interval based on rate limit

// second: * * * * * *
// minute: * * * * *

const worker = cron.schedule('* * * * *', async () => {
  logger.info('Creating order');

  try {

    const listData = await pipedriveAPI.list({
      apiToken,
      limit: 100
    });

    listData.data.map(async (deal, index) => {

      const {
        person_id
      } = deal;

      const dealProductsData = await listDealProducts({
        dealId: deal.id,
        apiToken
      });

      const products = dealProductsData.data;

      const phone = person_id?.email.find(({ primary }) => primary)?.value;
      const email = person_id?.phone.find(({ primary }) => primary)?.value;

      const order: Order = {
        cliente: {
          nome: person_id?.name || 'Usuário sem nome',
          fone: phone,
          email,
          'tipoPessoa': 'J',
          'endereco': 'Rua Visconde de São Gabriel',
          'cpf_cnpj': '00000000000000',
          'ie': '3067663000',
          'numero': '392',
          'complemento': 'Sala 54',
          'bairro': 'Cidade Alta',
          'cep': '95.700-000',
          'cidade': 'Bento Gonçalves',
          'uf': 'RS',
        },
        obs: `Order ${deal.id}`,
        itens: products?.map((product, index) => (
          {
            item: {
              codigo: '223435780',
              descricao: product.name,
              un: 'Pç',
              qtde: product.quantity,
              vlr_unit: product.item_price,
            }
          }
        ))
      };

      const data = await blingAPI.createOrder({
        apiKey:
          '72fc8fab18ef3e077a0adbdd13125e089e997785206751f49fbca9ca48248821b97b9b86',
        order,
      });

      // console.log(JSON.stringify(data, null, 2));

      const errors = data.retorno.erros;

      if (Array.isArray(errors) && errors.length > 0) {
        logger.info(errors?.[0]?.erro.msg);
      } else {
        logger.info(`Order created ${data.retorno.pedidos?.[0]?.pedido?.idPedido}`);
      }
    })

  } catch (reason) {
    logger.error(reason);
  }

}, {
  scheduled: false,
  timezone: 'America/Sao_Paulo'
});

const startWorker = () => {
  logger.info('Starting integration worker');
  worker.start();
}

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
  startIntegration,
  startWorker
}