import { Schema, model, Document } from 'mongoose';

export interface IAnalytics extends Document {
  // Define fields here
  name: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
  },
  { timestamps: true }
);

export default model<IAnalytics>('Analytics', AnalyticsSchema);
