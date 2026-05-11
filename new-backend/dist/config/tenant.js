"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTenant = exports.getDefaultTenant = exports.findTenant = exports.getTenantConnection = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const tenant_model_1 = __importDefault(require("../models/tenant.model"));
const MONGO_URI = process.env.MONGO_URI || '';
const DEFAULT_TENANT_SLUG = process.env.DEFAULT_TENANT_SLUG || 'default';
function parseDbNameFromUri(uri) {
    try {
        const url = new URL(uri);
        const pathname = url.pathname || '';
        return pathname.replace(/^\//, '') || 'admin';
    }
    catch {
        return 'admin';
    }
}
function normalizeDbName(value) {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '');
}
const DEFAULT_DB_NAME = process.env.DEFAULT_DB_NAME || parseDbNameFromUri(MONGO_URI);
const tenantConnections = new Map();
const getTenantConnection = (tenant) => {
    if (!tenant) {
        throw new Error('Tenant is required to resolve connection');
    }
    const key = tenant._id.toString();
    if (tenantConnections.has(key)) {
        return tenantConnections.get(key);
    }
    const rawName = tenant.dbName || tenant.tenantId || tenant.slug;
    const dbName = normalizeDbName(rawName);
    const connection = mongoose_1.default.connection.useDb(dbName, { useCache: true });
    tenantConnections.set(key, connection);
    return connection;
};
exports.getTenantConnection = getTenantConnection;
const findTenant = async (options) => {
    if (options.email) {
        const byEmail = await tenant_model_1.default.findOne({ email: options.email });
        if (byEmail)
            return byEmail;
    }
    if (options.tenantId) {
        const byTenantId = await tenant_model_1.default.findOne({ tenantId: options.tenantId });
        if (byTenantId)
            return byTenantId;
        if (mongoose_1.Types.ObjectId.isValid(options.tenantId)) {
            const byObjectId = await tenant_model_1.default.findById(options.tenantId);
            if (byObjectId)
                return byObjectId;
        }
    }
    if (options.tenantSlug) {
        return await tenant_model_1.default.findOne({ slug: options.tenantSlug });
    }
    return null;
};
exports.findTenant = findTenant;
const getDefaultTenant = async () => {
    let tenant = await tenant_model_1.default.findOne({ slug: DEFAULT_TENANT_SLUG });
    if (!tenant) {
        tenant = await tenant_model_1.default.create({
            tenantId: '0000',
            name: 'Default Tenant',
            slug: DEFAULT_TENANT_SLUG,
            dbName: DEFAULT_DB_NAME,
            settings: {},
        });
        return tenant;
    }
    if (!tenant.tenantId) {
        tenant.tenantId = '0000';
    }
    if (!tenant.dbName) {
        tenant.dbName = DEFAULT_DB_NAME;
    }
    await tenant.save();
    return tenant;
};
exports.getDefaultTenant = getDefaultTenant;
const resolveTenant = async (options) => {
    const tenant = await (0, exports.findTenant)(options);
    if (tenant)
        return tenant;
    if (!options.tenantSlug && !options.tenantId) {
        return await (0, exports.getDefaultTenant)();
    }
    return null;
};
exports.resolveTenant = resolveTenant;
//# sourceMappingURL=tenant.js.map