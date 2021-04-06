import mongoose, { Schema, Types } from 'mongoose';
import { IntegrationDoc } from '../types/integration.types';

const IntegrationSchema = new Schema(
  {
    /*
      Last fetched deal page from pipedrive 
      this id will be used to skip previous inserted deals
    */
    nextPipedriveDealsPage: {
      type: Number,
      default: 0,
    },
    /*
      Count of integrated deals from last page
      this count will be used to skip previous inserted deals from last page
    */
    lastIntegratedPageDealsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc: IntegrationDoc, ret: IntegrationDoc) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface IntegrationModel extends mongoose.Model<IntegrationDoc> { }

const Integration = mongoose.model<IntegrationDoc, IntegrationModel>('Integration', IntegrationSchema);

Integration.createCollection({});

export default Integration;
