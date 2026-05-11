"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePublicOrder = exports.getMyPublicOrders = exports.createPublicOrder = exports.getPublicClientSession = exports.loginPublicClient = exports.registerPublicClient = exports.lookupPublicClientByMobile = exports.getPublicProductBySlug = exports.getPublicFeaturedProducts = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const tenant_1 = require("../config/tenant");
const tenant_service_1 = require("../services/tenant.service");
const parseQuantity = (value) => {
    const quantity = Number(value);
    return Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1;
};
const normalizeMobile = (mobile) => String(mobile || "")
    .replace(/\D/g, "")
    .trim();
const getItemUnitPrice = (product) => {
    const price = Number(product?.sellingPrice ?? product?.mrp ?? 0);
    return Number.isFinite(price) ? price : 0;
};
const CANCELLATION_WINDOW_MS = 2 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || "access_secret";
const sanitizeClient = (client) => {
    if (!client)
        return null;
    return {
        _id: String(client._id),
        name: client.name || "",
        mobile: client.mobile || "",
        email: client.email || "",
        addressLine1: client.addressLine1 || "",
        addressLine2: client.addressLine2 || "",
        city: client.city || "",
        notes: client.notes || "",
        hasPassword: Boolean(client.password),
    };
};
const generatePublicClientToken = (payload) => jsonwebtoken_1.default.sign({
    type: "public_client",
    clientId: payload.clientId,
    mobile: payload.mobile,
    tenantId: payload.tenantId,
    tenantSlug: payload.tenantSlug,
}, JWT_SECRET, { expiresIn: "30d" });
const getPublicFeaturedProducts = async (req, res) => {
    try {
        const tenantSlug = typeof req.query.tenantSlug === "string" ? req.query.tenantSlug : undefined;
        const { Product } = await (0, tenant_service_1.getTenantModelsBySlug)(tenantSlug);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
        const products = await Product.find({
            isFeatured: true,
            isActive: { $ne: false },
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
            .exec();
        return res.json({ data: products });
    }
    catch (error) {
        console.error("getPublicFeaturedProducts error", error);
        return res.status(500).json({ message: "Failed to fetch featured products" });
    }
};
exports.getPublicFeaturedProducts = getPublicFeaturedProducts;
const getPublicProductBySlug = async (req, res) => {
    try {
        const tenantSlug = typeof req.query.tenantSlug === "string" ? req.query.tenantSlug : undefined;
        const { Product } = await (0, tenant_service_1.getTenantModelsBySlug)(tenantSlug);
        const slug = String(req.params.slug || "");
        const product = mongoose_1.Types.ObjectId.isValid(slug)
            ? await Product.findById(slug).lean().exec()
            : await Product.findOne({ slug, isActive: { $ne: false } }).lean().exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json(product);
    }
    catch (error) {
        console.error("getPublicProductBySlug error", error);
        return res.status(500).json({ message: "Failed to fetch product" });
    }
};
exports.getPublicProductBySlug = getPublicProductBySlug;
const lookupPublicClientByMobile = async (req, res) => {
    try {
        const tenantSlug = typeof req.query.tenantSlug === "string" ? req.query.tenantSlug : undefined;
        const mobile = normalizeMobile(req.query.mobile);
        if (!mobile) {
            return res.status(400).json({ message: "Mobile number is required" });
        }
        const { Client } = await (0, tenant_service_1.getTenantModelsBySlug)(tenantSlug);
        const client = await Client.findOne({ mobile }).select("+password").lean().exec();
        return res.json({ data: sanitizeClient(client) || null });
    }
    catch (error) {
        console.error("lookupPublicClientByMobile error", error);
        return res.status(500).json({ message: "Failed to lookup client" });
    }
};
exports.lookupPublicClientByMobile = lookupPublicClientByMobile;
const registerPublicClient = async (req, res) => {
    try {
        const tenantSlug = typeof req.body?.tenantSlug === "string"
            ? req.body.tenantSlug
            : typeof req.query.tenantSlug === "string"
                ? req.query.tenantSlug
                : undefined;
        const mobile = normalizeMobile(req.body?.mobile);
        const password = String(req.body?.password || "");
        const name = String(req.body?.name || "").trim();
        if (!mobile || mobile.length < 10) {
            return res.status(400).json({ message: "Valid mobile number is required" });
        }
        if (password.length < 4) {
            return res.status(400).json({ message: "Password must be at least 4 characters" });
        }
        const tenant = await (0, tenant_1.resolveTenant)({ tenantSlug });
        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }
        const { Client } = await (0, tenant_service_1.getTenantModelsBySlug)(tenant.slug);
        const existingClient = await Client.findOne({ mobile }).select("+password").exec();
        if (existingClient?.password) {
            return res.status(400).json({ message: "Account already exists. Please log in." });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const client = await Client.findOneAndUpdate({ mobile }, {
            $set: {
                mobile,
                name: name || existingClient?.name || "Customer",
                password: hashedPassword,
            },
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        })
            .select("+password")
            .exec();
        const token = generatePublicClientToken({
            clientId: String(client._id),
            mobile: client.mobile,
            tenantId: tenant.tenantId,
            tenantSlug: tenant.slug,
        });
        return res.status(201).json({
            token,
            client: sanitizeClient(client),
        });
    }
    catch (error) {
        console.error("registerPublicClient error", error);
        return res.status(500).json({ message: "Failed to register account" });
    }
};
exports.registerPublicClient = registerPublicClient;
const loginPublicClient = async (req, res) => {
    try {
        const tenantSlug = typeof req.body?.tenantSlug === "string"
            ? req.body.tenantSlug
            : typeof req.query.tenantSlug === "string"
                ? req.query.tenantSlug
                : undefined;
        const mobile = normalizeMobile(req.body?.mobile);
        const password = String(req.body?.password || "");
        if (!mobile || !password) {
            return res.status(400).json({ message: "Mobile number and password are required" });
        }
        const tenant = await (0, tenant_1.resolveTenant)({ tenantSlug });
        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }
        const { Client } = await (0, tenant_service_1.getTenantModelsBySlug)(tenant.slug);
        const client = await Client.findOne({ mobile }).select("+password").exec();
        if (!client?.password) {
            return res.status(400).json({ message: "Account not found. Please sign up first." });
        }
        const isValid = await bcryptjs_1.default.compare(password, client.password);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid mobile number or password" });
        }
        const token = generatePublicClientToken({
            clientId: String(client._id),
            mobile: client.mobile,
            tenantId: tenant.tenantId,
            tenantSlug: tenant.slug,
        });
        return res.json({
            token,
            client: sanitizeClient(client),
        });
    }
    catch (error) {
        console.error("loginPublicClient error", error);
        return res.status(500).json({ message: "Failed to login" });
    }
};
exports.loginPublicClient = loginPublicClient;
const getPublicClientSession = async (req, res) => {
    try {
        const tenantSlug = req.publicClient?.tenantSlug;
        const clientId = req.publicClient?.clientId;
        if (!tenantSlug || !clientId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { Client } = await (0, tenant_service_1.getTenantModelsBySlug)(tenantSlug);
        const client = await Client.findById(clientId).select("+password").lean().exec();
        if (!client) {
            return res.status(404).json({ message: "Account not found" });
        }
        return res.json({ client: sanitizeClient(client) });
    }
    catch (error) {
        console.error("getPublicClientSession error", error);
        return res.status(500).json({ message: "Failed to load session" });
    }
};
exports.getPublicClientSession = getPublicClientSession;
const createPublicOrder = async (req, res) => {
    try {
        const { tenantSlug, items = [], payment_type = "cash", client: clientPayload = {}, customer_note, } = req.body || {};
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order items are required" });
        }
        const normalizedMobile = normalizeMobile(clientPayload.mobile);
        if (!clientPayload.name || !normalizedMobile) {
            return res
                .status(400)
                .json({ message: "Client name and mobile number are required" });
        }
        if (!["cash", "online"].includes(payment_type)) {
            return res.status(400).json({ message: "Invalid payment type" });
        }
        const { Product, Order, Client } = await (0, tenant_service_1.getTenantModelsBySlug)(tenantSlug);
        const productIds = items.map((item) => item.product).filter(Boolean);
        const products = await Product.find({
            _id: { $in: productIds },
            isActive: { $ne: false },
        })
            .lean()
            .exec();
        const productsById = new Map(products.map((product) => [String(product._id), product]));
        const normalizedItems = items.map((item) => {
            const product = productsById.get(String(item.product));
            if (!product) {
                throw new Error("One or more products are unavailable");
            }
            const quantity = parseQuantity(item.quantity);
            if (Number(product.stockQty || 0) < quantity) {
                throw new Error(`${product.name} does not have enough stock`);
            }
            const price = getItemUnitPrice(product);
            return {
                product: product._id,
                quantity,
                price,
                lineTotal: Number((price * quantity).toFixed(2)),
            };
        });
        const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
        const total = Number(subtotal.toFixed(2));
        const client = await Client.findOneAndUpdate({ mobile: normalizedMobile }, {
            $set: {
                name: String(clientPayload.name).trim(),
                mobile: normalizedMobile,
                email: clientPayload.email?.trim() || null,
                addressLine1: clientPayload.addressLine1?.trim() || null,
                addressLine2: clientPayload.addressLine2?.trim() || null,
                city: clientPayload.city?.trim() || null,
                notes: clientPayload.notes?.trim() || null,
                lastOrderAt: new Date(),
            },
            $inc: {
                totalOrders: 1,
                totalSpent: total,
            },
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        const orderCount = await Order.countDocuments();
        const order_id = `ORD${String(orderCount + 1).padStart(4, "0")}`;
        const order = new Order({
            user: null,
            client: client._id,
            order_id,
            order_from: "WEB",
            customer_name: client.name,
            customer_phone: client.mobile,
            customer_email: client.email || null,
            delivery_address: {
                addressLine1: client.addressLine1 || null,
                addressLine2: client.addressLine2 || null,
                city: client.city || null,
            },
            customer_note: customer_note?.trim() || null,
            payment_type,
            items: normalizedItems.map((item) => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price,
            })),
            subtotal: total,
            discount: 0,
            tax: 0,
            total,
            paidAmount: 0,
            credit: 0,
            status: "ordered",
        });
        await order.save();
        const bulkOps = normalizedItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stockQty: -item.quantity } },
            },
        }));
        await Product.bulkWrite(bulkOps);
        return res.status(201).json({
            message: "Order placed successfully",
            order,
            client,
        });
    }
    catch (error) {
        console.error("createPublicOrder error", error);
        return res.status(500).json({
            message: error?.message || "Failed to create public order",
        });
    }
};
exports.createPublicOrder = createPublicOrder;
const getMyPublicOrders = async (req, res) => {
    try {
        const tenantSlug = req.publicClient?.tenantSlug;
        const mobile = normalizeMobile(req.publicClient?.mobile);
        if (!tenantSlug || !mobile) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { Order } = await (0, tenant_service_1.getTenantModelsBySlug)(tenantSlug);
        const orders = await Order.find({ customer_phone: mobile, order_from: "WEB" })
            .populate("items.product", "name slug images")
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        const data = orders.map((order) => ({
            ...order,
            canDelete: order.status === "ordered" &&
                Date.now() - new Date(order.createdAt).getTime() <= CANCELLATION_WINDOW_MS,
        }));
        return res.json({ data });
    }
    catch (error) {
        console.error("getMyPublicOrders error", error);
        return res.status(500).json({ message: "Failed to fetch orders" });
    }
};
exports.getMyPublicOrders = getMyPublicOrders;
const deletePublicOrder = async (req, res) => {
    try {
        const tenantSlug = req.publicClient?.tenantSlug;
        const mobile = normalizeMobile(req.publicClient?.mobile);
        const { id } = req.params;
        if (!tenantSlug || !mobile) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { Order, Product, Client } = await (0, tenant_service_1.getTenantModelsBySlug)(tenantSlug);
        const order = await Order.findOne({
            _id: id,
            customer_phone: mobile,
            order_from: "WEB",
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status !== "ordered") {
            return res.status(400).json({ message: "Only new orders can be deleted" });
        }
        const orderAge = Date.now() - new Date(order.createdAt).getTime();
        if (orderAge > CANCELLATION_WINDOW_MS) {
            return res
                .status(400)
                .json({ message: "Order can only be deleted within 2 minutes" });
        }
        const bulkOps = (order.items || []).map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { stockQty: Number(item.quantity || 0) } },
            },
        }));
        if (bulkOps.length) {
            await Product.bulkWrite(bulkOps);
        }
        if (order.client) {
            await Client.findByIdAndUpdate(order.client, {
                $inc: {
                    totalOrders: -1,
                    totalSpent: -Number(order.total || 0),
                },
            });
        }
        await Order.findByIdAndDelete(id);
        return res.json({ message: "Order deleted successfully" });
    }
    catch (error) {
        console.error("deletePublicOrder error", error);
        return res.status(500).json({ message: "Failed to delete order" });
    }
};
exports.deletePublicOrder = deletePublicOrder;
//# sourceMappingURL=public.controller.js.map