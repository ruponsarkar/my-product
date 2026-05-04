"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "access_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
/* ============================
   TOKEN HELPERS
============================ */
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, {
        expiresIn: "1d",
    });
};
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
/* ============================
   REGISTER
============================ */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await user_model_1.default.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        // password hashing is handled in model
        const user = new user_model_1.default({ name, email, password });
        await user.save();
        res.status(201).json({
            message: "User registered successfully",
        });
    }
    catch (err) {
        console.log("Registration error:", err);
        
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};
exports.register = register;
/* ============================
   LOGIN
============================ */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        res.json({
            token: accessToken,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: "Login failed" });
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
        const newAccessToken = generateAccessToken(decoded.id);
        res.json({
            token: newAccessToken,
        });
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
const logout = async (_req, res) => {
    return res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map