import { Document } from 'mongoose';

export interface IntegrationType {
  id?: string;
  total: number;
}

export interface IntegrationDoc extends IntegrationType, Document {
  createdAt?: Date;
  updatedAt?: Date;
}
