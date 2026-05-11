"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicClientAuthMiddleware = exports.authorizeRoles = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "access_secret";
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.log("No token, authorization denied");
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log("Token is not valid");
        res.status(401).json({ message: "Token is not valid" });
    }
};
exports.authMiddleware = authMiddleware;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.length || roles.includes(req.user.role)) {
            return next();
        }
        return res.status(403).json({ message: "Forbidden" });
    };
};
exports.authorizeRoles = authorizeRoles;
const publicClientAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.type !== "public_client" || !decoded.clientId) {
            return res.status(401).json({ message: "Token is not valid" });
        }
        req.publicClient = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Token is not valid" });
    }
};
exports.publicClientAuthMiddleware = publicClientAuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map