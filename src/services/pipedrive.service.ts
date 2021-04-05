import { Types } from 'mongoose';
import axios, { AxiosError } from 'axios';

const baseUrl = 'https://api.pipedrive.com/v1/deals';
interface ListParamsType {
  start: number;
  limit: number,
  apiToken: string;
}

/**
 * List all deals from pipedrive service
 *
 * @param {ListParamsType} {
 *     start = 0,
 *     limit = 100,
 *     apiToken = 'b51865d76db88d36e9d37b362c04cc0ea7900649'
 *   }
 * @return {*}  {Promise<any>}
 */
const list = async (
  {
    start = 0,
    limit = 100,
    apiToken = 'b51865d76db88d36e9d37b362c04cc0ea7900649'
  }: ListParamsType
): Promise<any> => {

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
  }
};

export { list };
