import { Document } from 'mongoose';

export interface IntegrationType {
  nextPipedriveDealsPage: number
  lastIntegratedPageDealsCount: number
}

export interface IntegrationDoc extends IntegrationType, Document {
  createdAt?: Date
  updatedAt?: Date
}
