import mongoose, { Schema, Types } from 'mongoose';
import { ResumeDoc } from '../types/resume.types';

const ResumeSchema = new Schema(
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
      transform(doc: ResumeDoc, ret: ResumeDoc) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface ResumeModel extends mongoose.Model<ResumeDoc> { }

const Resume = mongoose.model<ResumeDoc, ResumeModel>('Resume', ResumeSchema);

Resume.createCollection({});

export default Resume;
