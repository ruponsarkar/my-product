"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForm_attritubes = exports.getAllForm_attritubess = void 0;
const form_attritubes_model_1 = __importDefault(require("../models/form_attritubes.model"));
const getAllForm_attritubess = async (req, res) => {
    const data = await form_attritubes_model_1.default.find();
    res.json(data);
};
exports.getAllForm_attritubess = getAllForm_attritubess;
const createForm_attritubes = async (req, res) => {
    const item = new form_attritubes_model_1.default(req.body);
    await item.save();
    res.status(201).json(item);
};
exports.createForm_attritubes = createForm_attritubes;
//# sourceMappingURL=form_attritubes.controller.js.map