import { Schema, model, Connection, Model, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  mobile: string;
  password?: string | null;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true, unique: true, index: true },
    password: { type: String, default: null, select: false },
    email: { type: String, trim: true, default: null },
    addressLine1: { type: String, trim: true, default: null },
    addressLine2: { type: String, trim: true, default: null },
    city: { type: String, trim: true, default: null },
    notes: { type: String, trim: true, default: null },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const getClientModel = (conn: Connection, collectionName?: string): Model<IClient> => {
  if (conn.models.Client) return conn.models.Client as Model<IClient>;
  return conn.model<IClient>("Client", clientSchema, collectionName);
};

export default model<IClient>("Client", clientSchema);
