import { Schema, model, Document, Connection } from 'mongoose';

export interface ITenant extends Document {
  _id: any;
  tenantId: string;
  name: string;
  slug: string;
  email: string;
  password: string;
  dbName: string;
  settings: Record<string, any>;
  status: 'active' | 'inactive';
  createdAt?: Date;
  updatedAt?: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    dbName: { type: String, required: true, unique: true, index: true },
    settings: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const getTenantModel = (conn: Connection) => {
  if (conn.models.Tenant) return conn.models.Tenant as ReturnType<typeof model>;
  return conn.model<ITenant>('Tenant', TenantSchema, 'accounts');
};

export default model<ITenant>('Tenant', TenantSchema, 'accounts');
