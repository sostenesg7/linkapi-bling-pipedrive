import { Document } from 'mongoose';

export interface IntegrationType {
  /*
    Last fetched deal id from pipedrive 
    this id will be used while fetch more deals
  */
  lastPipedriveDealId: number
}

export interface IntegrationDoc extends IntegrationType, Document {
  createdAt?: Date
  updatedAt?: Date
}
