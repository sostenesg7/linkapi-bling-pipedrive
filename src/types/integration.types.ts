import { Document } from 'mongoose';

export interface IntegrationType {
  lastPipedriveDealsPage: number
  integratedDealsCount: number
}

export interface IntegrationDoc extends IntegrationType, Document {
  createdAt?: Date
  updatedAt?: Date
}
