"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTenantSettings = exports.getTenantSettings = void 0;
const tenant_model_1 = __importDefault(require("../models/tenant.model"));
const normalizeSettings = (value) => {
    if (!value)
        return {};
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        }
        catch (error) {
            console.warn('Unable to parse string settings as JSON', error);
            return {};
        }
    }
    return typeof value === 'object' ? value : {};
};
const getTenantSettings = async (req, res) => {
    try {
        const tenant = await tenant_model_1.default.findOne({ tenantId: req.user.tenantId });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        return res.json(normalizeSettings(tenant.settings));
    }
    catch (err) {
        console.error('Failed to get tenant settings', err);
        return res.status(500).json({ message: 'Failed to load settings' });
    }
};
exports.getTenantSettings = getTenantSettings;
const updateTenantSettings = async (req, res) => {
    try {
        const tenant = await tenant_model_1.default.findOne({ tenantId: req.user.tenantId });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        tenant.settings = {
            ...normalizeSettings(tenant.settings),
            ...normalizeSettings(req.body),
        };
        await tenant.save();
        return res.json(normalizeSettings(tenant.settings));
    }
    catch (err) {
        console.error('Failed to update tenant settings', err);
        return res.status(500).json({ message: 'Failed to update settings' });
    }
};
exports.updateTenantSettings = updateTenantSettings;
//# sourceMappingURL=settings.controller.js.map