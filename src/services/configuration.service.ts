import { createProduct } from '../apis/bling.api';
import { createDealsFilter, getFilterById } from '../apis/pipedrive.api';
import { EnvType } from '../types/common.types';
import { logger } from '../util';
import { Messages, DEALS_FILTER_REDIS_KEY, BLING_PRODUCT_CODE_REDIS_KEY } from '../util/constants';
import { redis } from './pipedrive.service';

const { PIPEDRIVE_API_KEY = '', BLING_API_KEY = '' } = process.env as EnvType;

/**
 * Configure some params before start integration
 * Create a filter to find deals of the day, on pipedrive service;
 * Create a product on bling srevice, to use as a reference in orders;
 *
 */
const startAutomaticConfiguration = async () => {
  logger.info(Messages.STARTING_AUTOMATIC_CONFIGURATION);

  const filterId = Number(await redis.get(DEALS_FILTER_REDIS_KEY)) || 0;

  /* 
  * Try to find filter on pipedrive, based on local last saved filter id
  * If not found, create one
  */
  try {
    await getFilterById({ apiToken: PIPEDRIVE_API_KEY, filterId });
  } catch (reason) {
    const filter = (await createDealsFilter({ apiToken: PIPEDRIVE_API_KEY })).data;
    await redis.set(DEALS_FILTER_REDIS_KEY, filter.id);
    logger.info(Messages.PIPEDRIVE_CREATING_DEALS_FILTER);
  }

  /* Create one product on bling to use in all orders */
  const response = await createProduct({
    apiKey: BLING_API_KEY,
    product: {
      id: '11948415608',
      codigo: '223435780',
      descricao: 'MOUSE GAMER THERMALTAKE IRIS 5000',
      descricaoComplementar: 'MOUSE GAMER THERMALTAKE IRIS 5000 DPI RGB, MO-IRS-WDOHBK-04',
      tipo: 'P',
      situacao: 'Ativo',
      unidade: 'Pc',
      preco: '268.90',
      cest: '28.040.00',
      class_fiscal: '1000.01.01',
      gtin: '223435780',
      gtinEmbalagem: '54546',
      marca: 'Thermaltake',
    },
  });

  const product = response.retorno.produtos[0].produto;
  
  await redis.set(BLING_PRODUCT_CODE_REDIS_KEY, product.codigo);
  logger.info(Messages.BLING_CREATING_PRODUCT);
};

export { startAutomaticConfiguration };
