import { Schema, model, Document, Connection, Model } from 'mongoose';

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

export const getAnalyticModel = (conn: Connection, collectionName?: string): Model<IAnalytic> => {
  if (conn.models.Analytic) return conn.models.Analytic as Model<IAnalytic>;
  return conn.model<IAnalytic>('Analytic', AnalyticSchema, collectionName);
};

export default model<IAnalytic>('Analytic', AnalyticSchema);
