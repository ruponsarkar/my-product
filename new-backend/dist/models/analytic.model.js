"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AnalyticSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Analytic', AnalyticSchema);
//# sourceMappingURL=analytic.model.js.map