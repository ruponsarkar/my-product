"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantModelsBySlug = exports.lookupTenant = exports.getTenantModels = exports.initializeTenantCollections = exports.tenantModelFactories = void 0;
const tenant_1 = require("../config/tenant");
const user_model_1 = require("../models/user.model");
const product_model_1 = require("../models/product.model");
const order_model_1 = require("../models/order.model");
const client_model_1 = require("../models/client.model");
const form_model_1 = require("../models/form.model");
const form_attritubes_model_1 = require("../models/form_attritubes.model");
const analytic_model_1 = require("../models/analytic.model");
exports.tenantModelFactories = [
    user_model_1.getUserModel,
    product_model_1.getProductModel,
    order_model_1.getOrderModel,
    client_model_1.getClientModel,
    form_model_1.getFormModel,
    form_attritubes_model_1.getFormAttributesModel,
    analytic_model_1.getAnalyticModel,
];
const initializeTenantCollections = async (conn) => {
    const models = exports.tenantModelFactories.map(factory => factory(conn));
    await Promise.all(models.map(async (model) => {
        try {
            await model.createCollection();
        }
        catch (err) {
            if (err && err.codeName !== 'NamespaceExists') {
                throw err;
            }
        }
        try {
            await model.syncIndexes();
        }
        catch (syncErr) {
            console.warn(`Failed to sync indexes for ${model.modelName}`, syncErr);
        }
    }));
};
exports.initializeTenantCollections = initializeTenantCollections;
const getTenantConnectionFromRequest = async (req) => {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
        throw new Error('Tenant ID missing from request. Provide tenantId in the auth token.');
    }
    const tenant = await (0, tenant_1.resolveTenant)({ tenantId });
    if (!tenant) {
        throw new Error('Tenant not found for request');
    }
    return { conn: (0, tenant_1.getTenantConnection)(tenant), tenant };
};
const getTenantModels = async (req) => {
    const { conn } = await getTenantConnectionFromRequest(req);
    return {
        User: (0, user_model_1.getUserModel)(conn),
        Product: (0, product_model_1.getProductModel)(conn),
        Order: (0, order_model_1.getOrderModel)(conn),
        Client: (0, client_model_1.getClientModel)(conn),
        Form: (0, form_model_1.getFormModel)(conn),
        FormAttributes: (0, form_attritubes_model_1.getFormAttributesModel)(conn),
        Analytic: (0, analytic_model_1.getAnalyticModel)(conn),
    };
};
exports.getTenantModels = getTenantModels;
const lookupTenant = async (tenantSlug) => {
    if (!tenantSlug)
        return null;
    return (0, tenant_1.findTenant)({ tenantSlug });
};
exports.lookupTenant = lookupTenant;
const getTenantModelsBySlug = async (tenantSlug) => {
    const tenant = tenantSlug
        ? await (0, tenant_1.resolveTenant)({ tenantSlug })
        : await (0, tenant_1.resolveTenant)({});
    if (!tenant) {
        throw new Error("Tenant not found");
    }
    const conn = (0, tenant_1.getTenantConnection)(tenant);
    return {
        User: (0, user_model_1.getUserModel)(conn),
        Product: (0, product_model_1.getProductModel)(conn),
        Order: (0, order_model_1.getOrderModel)(conn),
        Client: (0, client_model_1.getClientModel)(conn),
        Form: (0, form_model_1.getFormModel)(conn),
        FormAttributes: (0, form_attritubes_model_1.getFormAttributesModel)(conn),
        Analytic: (0, analytic_model_1.getAnalyticModel)(conn),
    };
};
exports.getTenantModelsBySlug = getTenantModelsBySlug;
//# sourceMappingURL=tenant.service.js.map