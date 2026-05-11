"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientModel = void 0;
const mongoose_1 = require("mongoose");
const clientSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
const getClientModel = (conn, collectionName) => {
    if (conn.models.Client)
        return conn.models.Client;
    return conn.model("Client", clientSchema, collectionName);
};
exports.getClientModel = getClientModel;
exports.default = (0, mongoose_1.model)("Client", clientSchema);
//# sourceMappingURL=client.model.js.map