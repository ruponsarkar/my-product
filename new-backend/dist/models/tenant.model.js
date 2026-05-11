"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantModel = void 0;
const mongoose_1 = require("mongoose");
const TenantSchema = new mongoose_1.Schema({
    tenantId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    dbName: { type: String, required: true, unique: true, index: true },
    settings: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });
const getTenantModel = (conn) => {
    if (conn.models.Tenant)
        return conn.models.Tenant;
    return conn.model('Tenant', TenantSchema, 'accounts');
};
exports.getTenantModel = getTenantModel;
exports.default = (0, mongoose_1.model)('Tenant', TenantSchema, 'accounts');
//# sourceMappingURL=tenant.model.js.map