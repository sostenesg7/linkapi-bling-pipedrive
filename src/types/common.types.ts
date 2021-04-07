import { Request } from 'express';

export interface CustomRequest<T> extends Request {
  body: T
}

export interface HttpError extends Error {
  status: number
  message: string
  code?: number
  keyValue?: any
}

export interface EnvType {
  REDIS_HOST?: string
  REDIS_PORT?: number
  REDIS_PASSWORD?: string
  PIPEDRIVE_API_KEY?: string
  BLING_API_KEY?: string
  PORT?: number
}
