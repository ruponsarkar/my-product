"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AnalyticsSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Analytics', AnalyticsSchema);
//# sourceMappingURL=analytics.model.js.map