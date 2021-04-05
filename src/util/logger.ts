import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;
import stream from 'stream';
import fs from 'fs';

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

export const logger = createLogger({
  format: combine(label({ label: '' }), timestamp(), logFormat),
  transports: [
    new transports.File({
      level: 'info',
      filename: './logs/log.log',
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
    }),
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export const loggerWrite = {
  write: function (message: string) {
    logger.info(message);
  },
};

logger.stream = (options?: any) => new stream.Duplex(loggerWrite);
