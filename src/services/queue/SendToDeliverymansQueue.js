const Queue = require('bull');
const moment = require('moment');
const { chunk } = require('lodash');
const uuidv4 = require('uuid').v4;
const chalk = require('chalk');
const ioredis = require('ioredis');

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

/**
 * Cria um fila de pedidos para os pedidos agendados
 *
 * @class SendToDeliverymansQueue
 */
class SendToDeliverymansQueue {
  constructor() {
    if (!SendToDeliverymansQueue.instance) {
      this.redis = new ioredis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      });

      this.redis.on('connect', () => {
        console.log(chalk.green(`>> REDIS CONNECTED`));
      });

      this.redis.on('error', error => {
        console.log(chalk.red(`>> REDIS ERROR: `, error));
      });

      this.queue = new Queue('sendToDeliverymans', {
        redis: {
          host: REDIS_HOST,
          port: REDIS_PORT,
          password: REDIS_PASSWORD,
        },
      });
      SendToDeliverymansQueue.instance = this;
    }
    return SendToDeliverymansQueue.instance;
  }

  /**
   *
   *
   * @param {*} [data={}]
   * @param {*} [options={attempts: 2}]
   * @returns Promise
   * @memberof SendToDeliverymansQueue
   * https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
   */
  insert(data = {}, options = { attempts: 2 }) {
    return this.queue.add(data, options);
  }

  /**
   * Consumidor
   *
   * @param {*} onProcess
   * @returns Promise
   * @memberof SendToDeliverymansQueue
   */
  process(onProcess) {
    return this.queue.process(async job => {
      /* publica o progresso para um listener
      job.progress(progress);
      */
      return await onProcess(job);
    });
  }
}

const instance = new SendToDeliverymansQueue();
Object.freeze(instance);

module.exports = instance;
