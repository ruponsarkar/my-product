"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormModel = void 0;
const mongoose_1 = require("mongoose");
const FormSchema = new mongoose_1.Schema({
    formName: { type: String, required: true, trim: true },
    formFor: { type: String, required: false, trim: true },
    description: { type: String, required: false, text: true, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
}, { timestamps: true });
// Indexes for faster searches
FormSchema.index({ formName: "text", description: "text" });
const getFormModel = (conn, collectionName) => {
    if (conn.models.Form)
        return conn.models.Form;
    return conn.model("Form", FormSchema, collectionName);
};
exports.getFormModel = getFormModel;
exports.default = (0, mongoose_1.model)("Form", FormSchema);
//# sourceMappingURL=form.model.js.map