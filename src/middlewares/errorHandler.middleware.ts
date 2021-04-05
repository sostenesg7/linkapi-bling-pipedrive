import { Request, Response, NextFunction } from 'express';
import { logger } from '../util/logger';
import { errors } from '../util';
import { HttpError } from '../types/common.types';

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info('error', err);
  res.status(err.status || 500).send({ message: err.message });
};
