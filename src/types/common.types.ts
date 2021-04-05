import { Request } from 'express';

export interface CustomRequest<T> extends Request {
  body: T;
}

export interface HttpError extends Error {
  status: number;
  message: string;
  code?: number;
  keyValue?: any;
}
