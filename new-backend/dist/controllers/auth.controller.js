"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const slugify_1 = __importDefault(require("slugify"));
const tenant_model_1 = __importDefault(require("../models/tenant.model"));
const tenant_1 = require("../config/tenant");
const user_model_1 = require("../models/user.model");
const tenant_service_1 = require("../services/tenant.service");
const JWT_SECRET = process.env.JWT_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const DEFAULT_ROLE = "admin";
/* ============================
   TOKEN HELPERS
============================ */
const generateAccessToken = (userId, tenantId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, tenantId, role }, JWT_SECRET, {
        expiresIn: "1d",
    });
};
const generateRefreshToken = (userId, tenantId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, tenantId, role }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
const deriveTenantSlug = (body) => {
    if (typeof body.tenantSlug === "string" && body.tenantSlug.trim()) {
        return (0, slugify_1.default)(body.tenantSlug, { lower: true, strict: true });
    }
    if (typeof body.accountName === "string" && body.accountName.trim()) {
        return (0, slugify_1.default)(body.accountName, { lower: true, strict: true });
    }
    if (typeof body.name === "string" && body.name.trim()) {
        return (0, slugify_1.default)(body.name, { lower: true, strict: true });
    }
    return null;
};
/* ============================
   REGISTER
============================ */
const getNextTenantId = async () => {
    const lastTenant = await tenant_model_1.default.findOne().sort({ tenantId: -1 });
    const lastId = lastTenant ? parseInt(lastTenant.tenantId, 10) : 0;
    const nextId = lastId >= 0 ? lastId + 1 : 1;
    return String(nextId).padStart(4, '0');
};
const register = async (req, res) => {
    try {
        const { accountName, tenantSlug: rawTenantSlug, name, email, password, settings } = req.body;
        const tenantSlug = deriveTenantSlug({ tenantSlug: rawTenantSlug, accountName, name });
        if (!tenantSlug) {
            return res.status(400).json({ message: 'accountName or tenantSlug is required' });
        }
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required for account registration' });
        }
        const existingTenant = await tenant_model_1.default.findOne({ $or: [{ slug: tenantSlug }, { email }] });
        if (existingTenant) {
            return res.status(400).json({ message: 'Tenant account with this slug or email already exists' });
        }
        const tenantId = await getNextTenantId();
        const dbPrefix = process.env.TENANT_DB_PREFIX || 'tenant_';
        const dbName = `${dbPrefix}${tenantId}`;
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        let tenantSettings = {};
        if (typeof settings === 'string') {
            try {
                tenantSettings = JSON.parse(settings || '{}');
            }
            catch (parseError) {
                console.warn('Unable to parse tenant settings string; defaulting to empty object.', parseError);
                tenantSettings = {};
            }
        }
        else {
            tenantSettings = settings || {};
        }
        const tenant = new tenant_model_1.default({
            tenantId,
            name: accountName || name || tenantSlug,
            slug: tenantSlug,
            email,
            password: hashedPassword,
            dbName,
            settings: tenantSettings,
        });
        await tenant.save();
        const connection = (0, tenant_1.getTenantConnection)(tenant);
        await (0, tenant_service_1.initializeTenantCollections)(connection);
        const TenantUser = (0, user_model_1.getUserModel)(connection);
        const existing = await TenantUser.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists in tenant' });
        }
        const user = new TenantUser({
            name,
            email,
            password,
            role: DEFAULT_ROLE,
        });
        await user.save();
        const accessToken = generateAccessToken(user._id.toString(), tenant.tenantId, user.role);
        const refreshToken = generateRefreshToken(user._id.toString(), tenant.tenantId, user.role);
        res.status(201).json({
            message: 'Tenant and user registered successfully',
            tenant: {
                id: tenant._id,
                tenantId: tenant.tenantId,
                name: tenant.name,
                slug: tenant.slug,
                dbName: tenant.dbName,
                settings: tenant.settings,
            },
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
            token: accessToken,
            refreshToken,
        });
    }
    catch (err) {
        console.error('register error', err);
        res.status(500).json({ message: 'Registration failed' });
    }
};
exports.register = register;
/* ============================
   LOGIN
============================ */
const login = async (req, res) => {
    try {
        const { tenantSlug, tenantId, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required' });
        }
        const tenant = await (0, tenant_1.findTenant)({ tenantId, tenantSlug, email });
        if (!tenant) {
            return res.status(400).json({ message: 'Tenant not found' });
        }
        const connection = (0, tenant_1.getTenantConnection)(tenant);
        const TenantUser = (0, user_model_1.getUserModel)(connection);
        const user = await TenantUser.findOne({ email, isActive: true });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials or user not active' });
        }
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const accessToken = generateAccessToken(user._id.toString(), tenant.tenantId, user.role);
        const refreshToken = generateRefreshToken(user._id.toString(), tenant.tenantId, user.role);
        res.json({
            token: accessToken,
            refreshToken,
            tenant: {
                id: tenant._id,
                tenantId: tenant.tenantId,
                name: tenant.name,
                slug: tenant.slug,
            },
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        });
    }
    catch (err) {
        console.error('login error', err);
        res.status(500).json({ message: 'Login failed' });
    }
};
exports.login = login;
/* ============================
   REFRESH TOKEN
============================ */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        const newAccessToken = generateAccessToken(decoded.id, decoded.tenantId, decoded.role);
        res.json({
            token: newAccessToken,
        });
    }
    catch (err) {
        console.error("refresh token error", err);
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
const logout = async (_req, res) => {
    return res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map