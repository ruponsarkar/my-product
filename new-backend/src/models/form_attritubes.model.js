"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FormAttributesSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Form_attributes", FormAttributesSchema);
//# sourceMappingURL=form_attritubes.model.js.map