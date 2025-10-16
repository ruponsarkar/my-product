import { Schema, model, Document } from "mongoose";

export interface IFormAttributes extends Document {
  name: string; // field key (e.g. "email")
  label: string; // display label (e.g. "Email Address")
  type: string; // input type: text, number, select, checkbox, radio, textarea, date, file, etc.
  cssClass?: string, // e.g. "form-input-lg primary-input"
  eventKey?: string, // e.g. "handleEmailChange"
  placeholder?: string; // placeholder text
  value?: string;
  defaultValue?: string; // default value
  options?: string[]; // for select, radio, checkbox
  required?: boolean; // is field mandatory
  minLength?: number;
  maxLength?: number;
  min?: number; // for number/date
  max?: number; // for number/date
  pattern?: string; // regex validation
  order?: number; // display order
  isActive?: boolean; // soft delete flag
  createdAt?: Date;
  updatedAt?: Date;
}

const FormAttributesSchema = new Schema<IFormAttributes>(
  {
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }, // text, number, select, etc.
    cssClass: { type: String }, // e.g. "form-input-lg primary-input"
    eventKey: { type: String }, // e.g. "handleEmailChange"
    placeholder: { type: String },
    value: { type: String },
    defaultValue: { type: String },
    options: [{ type: String }], // for dropdown, radio, checkbox
    required: { type: Boolean, default: false },
    minLength: { type: Number },
    maxLength: { type: Number },
    min: { type: Number },
    max: { type: Number },
    pattern: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IFormAttributes>("Form_attributes", FormAttributesSchema);
