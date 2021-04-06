import { Document } from 'mongoose';

export interface ResumeType {
  total: number
  date: string
  dayOfYear: number
}

export interface ResumeDoc extends ResumeType, Document {
  createdAt?: Date
  updatedAt?: Date
}
