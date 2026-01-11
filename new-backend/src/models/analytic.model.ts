import { Schema, model, Document } from 'mongoose';

export interface IAnalytic extends Document {
  // Define fields here
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AnalyticSchema = new Schema<IAnalytic>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
  },
  { timestamps: true }
);

export default model<IAnalytic>('Analytic', AnalyticSchema);
