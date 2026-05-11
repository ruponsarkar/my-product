"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticModel = void 0;
const mongoose_1 = require("mongoose");
const AnalyticSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // 👈 soft delete flag
}, { timestamps: true });
const getAnalyticModel = (conn, collectionName) => {
    if (conn.models.Analytic)
        return conn.models.Analytic;
    return conn.model('Analytic', AnalyticSchema, collectionName);
};
exports.getAnalyticModel = getAnalyticModel;
exports.default = (0, mongoose_1.model)('Analytic', AnalyticSchema);
//# sourceMappingURL=analytic.model.js.map