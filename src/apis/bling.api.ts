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
const http = rateLimit(client, { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 })
interface CreateOrderType {
  apiKey: string
  order: Order
}
interface CreateProductType {
  apiKey: string
  product: Product
}

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

    const { data } = await http.post('/pedido/json/', params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
    );

    return data;
  } catch (reason) {
    const error = reason as AxiosError;
    logger.error(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

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
    console.error(JSON.stringify(error.response?.data))
    return Promise.reject();
  }
};


export { createOrder, createProduct };
