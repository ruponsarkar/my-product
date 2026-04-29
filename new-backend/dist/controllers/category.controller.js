"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allBrands = exports.allCategory = void 0;
// import Category from '../models/category.model';
const product_model_1 = __importDefault(require("../models/product.model"));
const allCategory = async (req, res) => {
    try {
        const data = await product_model_1.default.distinct("category");
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.allCategory = allCategory;
const allBrands = async (req, res) => {
    try {
        const { category } = req.params;
        const data = await product_model_1.default.distinct("brand", { category });
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.allBrands = allBrands;
//# sourceMappingURL=category.controller.js.map