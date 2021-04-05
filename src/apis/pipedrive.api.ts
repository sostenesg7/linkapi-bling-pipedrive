import { Types } from 'mongoose';
import axios, { AxiosError } from 'axios';
import { Deal, DealListHttpResponse } from '../types/pipedrive.types';

const baseUrl = 'https://api.pipedrive.com/v1/deals';
interface ListParamsType {
  start?: number;
  limit?: number,
  apiToken: string;
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
    apiToken
  }: ListParamsType
): Promise<DealListHttpResponse | undefined> => {

  try {
    const { data } = await axios.get(baseUrl, {
      params: {
        start,
        limit,
        status: 'won',
        sort: 'update_time DESC',
        api_token: apiToken
      }
    });

    return data;
  } catch (reason) {
    const error = reason as AxiosError;
    console.error(error.response?.data);
    Promise.reject();
  }
};

export { list };
