import { Types } from 'mongoose';
import { Order, OrderHttpResponse, OrderHttpResponseError, Product, ProductHttpResponse } from '../types/bling.types';
import axios, { AxiosError } from 'axios';
import { parse as xmlToJSON } from 'js2xmlparser';
import { logger } from '../util';
import rateLimit from 'axios-rate-limit';

const client = axios.create({
  baseURL: 'https://bling.com.br/Api/v2'
});

/* 
  Bling rate limit: https://ajuda.bling.com.br/hc/pt-br/articles/360046302394-Limites
  Bling only support 3 request per second and 30.000 requests per day
  if the api rate limit is reached the request will return 429 status (too many requests)
*/
const axiosClient = rateLimit(client, { maxRequests: 1, perMilliseconds: 1000, maxRPS: 1 })
interface CreateOrderType {
  apiKey: string
  order: Order
}
interface CreateProductType {
  apiKey: string
  product: Product
}

/**
 * Create a new order on bling service
 *
 * @param {CreateOrderType} {
 *     apiKey,
 *     order
 *   }
 * @return {*}  {(Promise<OrderHttpResponse & OrderHttpResponseError>)}
 */
const createOrder = async (
  {
    apiKey,
    order
  }: CreateOrderType
): Promise<OrderHttpResponse & OrderHttpResponseError> => {

  try {

    const xml = xmlToJSON('pedido', order);

    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('xml', xml);

    const { data } = await axiosClient.post('/pedido/json/', params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
    );

    return data;
  } catch (reason) {
    return Promise.reject(reason);
  }
};

/**
 * Create a new product on blink service
 *
 * @param {CreateProductType} {
 *     apiKey,
 *     product,
 *   }
 * @return {*}  {Promise<any>}
 */
const createProduct = async (
  {
    apiKey,
    product,
  }: CreateProductType
): Promise<any> => {

  try {
    const xml = xmlToJSON('produto', product);

    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('xml', xml);

    const { data } = await axios.post('/produto/json/', params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
    );

    return data;
  } catch (reason) {
    const error = reason as AxiosError;
    return Promise.reject(reason);
  }
};


export { createOrder, createProduct };
