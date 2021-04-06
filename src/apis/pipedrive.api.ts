import { Types } from 'mongoose';
import axios, { AxiosError } from 'axios';
import { Deal, DealListHttpResponse } from '../types/pipedrive.types';
import { logger } from '../util';
import pipedriveMock from './mocks/pipedrive.mock';
import { DealProductsHttpResponse } from '../types/pipedrive.product.types';

const axiosClient = axios.create({
  baseURL: 'https://api.pipedrive.com/v1/deals'
});
interface ListParamsType {
  start?: number;
  limit?: number,
  apiToken: string;
}

interface ListOrderItemsParamsType {
  start?: number;
  limit?: number,
  apiToken: string;
  dealId: number;
}

/**
 * List all deals from pipedrive service
 *
 * @param {ListParamsType} {
 *     start = 0,
 *     limit = 100,
 *     apiToken
 *   }
 * @return {*}  {Promise<any>}
 */
const list = async (
  {
    start = 0,
    limit = 100,
    apiToken,
  }: ListParamsType
): Promise<DealListHttpResponse> => {
  try {

    // return (pipedriveMock as any) as DealListHttpResponse;

    const { data } = await axiosClient.get('', {
      params: {
        start,
        limit,
        status: 'won',
        // sort: 'update_time DESC',
        api_token: apiToken
      }
    });

    return data;
  } catch (reason) {
    const error = reason as AxiosError;
    logger.error(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

/**
 * List all deals items from pipedrive service
 *
 * @param {ListOrderItemsParamsType} {
 *     start = 0,
 *     limit = 100,
 *     apiToken,
 *     dealId,
 *   }
 * @return {*}  {Promise<any>}
 */
const listDealProducts = async (
  {
    start = 0,
    limit = 100,
    apiToken,
    dealId,
  }: ListOrderItemsParamsType
): Promise<DealProductsHttpResponse> => {
  try {

    const { data } = await axiosClient.get(`/${dealId}/products`, {
      params: {
        start,
        limit,
        api_token: apiToken,
        include_product_data: 0,
      }
    });

    return data;
  } catch (reason) {
    const error = reason as AxiosError;
    logger.error(error.response?.data);
    return Promise.reject(error.response?.data);
  }
};

export { list, listDealProducts };
