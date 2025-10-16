"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForm = exports.getAllForms = void 0;
const form_model_1 = __importDefault(require("../models/form.model"));
const getAllForms = async (req, res) => {
    const data = await form_model_1.default.find();
    res.json(data);
};
exports.getAllForms = getAllForms;
const createForm = async (req, res) => {
    const item = new form_model_1.default({ ...req.body, createdBy: req.user.id });
    await item.save();
    res.status(201).json(item);
};
exports.createForm = createForm;
//# sourceMappingURL=form.controller.js.map