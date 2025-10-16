import { Schema, model, Document, Types } from "mongoose";

export interface IForm extends Document {
  formName: string;
  formFor?: string;
  description?: string;
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const FormSchema = new Schema<IForm>(
  {
    formName: { type: String, required: true, trim: true },
    formFor: { type: String, required: false, trim: true },
    description: { type: String, required: false, text: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
  },
  { timestamps: true }
);

// Indexes for faster searches
FormSchema.index({ formName: "text", description: "text" });

export default model<IForm>("Form", FormSchema);
