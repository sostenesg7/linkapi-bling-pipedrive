import { Types } from 'mongoose';
import axios, { AxiosError } from 'axios';
import { Deal, DealListHttpResponse } from '../types/pipedrive.types';
import { logger } from '../util';
import pipedriveMock from './mocks/pipedrive.mock';
import { DealProductsHttpResponse } from '../types/pipedrive.product.types';
import { redis } from '../services/pipedrive.service';
import { OrderHttpResponse } from '../types/bling.types';
import { FilterDealsHttpResponse } from '../types/pipedrive.filter.types';
import { DealsFilter, DEALS_FILTER_REDIS_KEY } from '../util/constants';

const axiosClient = axios.create({
  baseURL: 'https://api.pipedrive.com/v1'
});

interface RequestType {
  apiToken: string
}

interface ListParamsType extends RequestType {
  start?: number
  limit?: number
}

interface ListOrderItemsParamsType extends RequestType {
  start?: number
  limit?: number
  dealId: number
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

    const filterId = await redis.get(DEALS_FILTER_REDIS_KEY);

    const { data } = await axiosClient.get('/deals', {
      params: {
        start,
        limit,
        // status: 'won',
        filter_id: filterId,
        // Order by creation date
        sort: 'add_time DESC',
        //sort: 'update_time DESC',
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

    const { data } = await axiosClient.get(`/deals/${dealId}/products`, {
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

/**
 * Create a deal filter with status=won
 * and creation_date=today
 *
 * @param {RequestType} {
 *     apiToken,
 *   }
 * @return {*}  {Promise<FilterDealsHttpResponse>}
 */
const createDealsFilter = async (
  {
    apiToken,
  }: RequestType
): Promise<FilterDealsHttpResponse> => {
  try {

    const { data } = await axiosClient.post(`/filters`, DealsFilter, {
      params: {
        api_token: apiToken,
      }
    });

    return data;
  } catch (reason) {
    const error = reason as AxiosError;
    logger.error(JSON.stringify(error.response?.data, null, 2));
    return Promise.reject(error.response?.data);
  }
};

/**
 * Returns data about a specific filter.
 *
 * @param {(RequestType & { filterId: number })} {
 *     filterId,
 *     apiToken,
 *   }
 * @return {*}  {Promise<FilterDealsHttpResponse>}
 */
const getFilterById = async (
  {
    filterId,
    apiToken,
  }: RequestType & { filterId: number }
): Promise<FilterDealsHttpResponse> => {
  try {

    const { data } = await axiosClient.get(`/filters/${filterId}`, {
      params: {
        api_token: apiToken,
      }
    });

    return data;
  } catch (reason) {
    const error = reason as AxiosError;
    logger.error(JSON.stringify(error.response?.data, null, 2));
    return Promise.reject(error.response?.data);
  }
};

export { list, listDealProducts, createDealsFilter, getFilterById };
