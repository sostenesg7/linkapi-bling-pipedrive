import mongoose, { Schema, Types } from 'mongoose';
import { IntegrationDoc } from '../types/integration.types';

const IntegrationSchema = new Schema(
  {
    total: {
      type: Number,
    },
    dayOfYear: {
      type: Number,
    },
    date: {
      type: String
    }
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
