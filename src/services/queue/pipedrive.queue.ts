import { logger } from '../../util';
import { RedisConnectionType } from '../../types/common.types';
import Queue from 'bull';
import ioredis from 'ioredis';

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD }: RedisConnectionType = (process.env as any);

const redis = new ioredis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  logger.info('>> REDIS CONNECTED');
});

redis.on('error', () => {
  console.log('>> REDIS ERROR:');
});

const pipedriveQueue = new Queue('pipedrive', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
});

export {
  pipedriveQueue,
  redis
}
