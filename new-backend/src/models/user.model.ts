import { Schema, model, Document, Connection, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  password: string;
  role: string;
  permissions?: string[];
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

export const getUserModel = (conn: Connection, collectionName?: string): Model<IUser> => {
  if (conn.models.User) return conn.models.User as Model<IUser>;
  return conn.model<IUser>('User', UserSchema, collectionName);
};

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, default: 'operator' },
  permissions: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function(candidate: string) {
  return bcrypt.compare(candidate, this.password);
}

export default model<IUser>('User', UserSchema);
