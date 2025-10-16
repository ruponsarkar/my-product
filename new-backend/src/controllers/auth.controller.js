"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // console.log("==>>", name, email, password); 
        const existing = await user_model_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "User already exists" });
        // const hashed = await bcrypt.hash(password, 10); //hash password is done on model
        const user = new user_model_1.default({ name, email, password: password });
        await user.save();
        res.status(201).json({ message: "User registered", user });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid email" });
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            return res.status(400).json({ message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
            expiresIn: "1d",
        });
        res.json({ token, user });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map