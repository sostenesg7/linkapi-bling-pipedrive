import { Types } from 'mongoose';
import { Order, Product, ProductHttpResponse } from '../types/bling.types';
import axios, { AxiosError } from 'axios';
import { parse as xmlToJSON } from 'js2xmlparser';

const baseUrl = 'https://bling.com.br/Api/v2';
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
): Promise<any> => {

  try {

    const xml = xmlToJSON('pedido', order);

    const params = new URLSearchParams();
    params.append('apikey', apiKey);
    params.append('xml', xml);

    const { data } = await axios.post(`${baseUrl}/pedido/json/`, params,
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
    return Promise.reject('');
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

    const { data } = await axios.post(`${baseUrl}/produto/json/`, params,
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
