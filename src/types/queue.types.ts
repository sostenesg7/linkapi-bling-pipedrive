import { Document } from 'mongoose';
import { Order } from './bling.types';

export interface QueueDoc extends Order, Document {
  createdAt?: Date
  updatedAt?: Date
}
