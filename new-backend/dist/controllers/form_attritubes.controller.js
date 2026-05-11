"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForm_attritubes = exports.getAllForm_attritubess = void 0;
const tenant_service_1 = require("../services/tenant.service");
const getAllForm_attritubess = async (req, res) => {
    const { FormAttributes } = await (0, tenant_service_1.getTenantModels)(req);
    const data = await FormAttributes.find();
    res.json(data);
};
exports.getAllForm_attritubess = getAllForm_attritubess;
const createForm_attritubes = async (req, res) => {
    const { FormAttributes } = await (0, tenant_service_1.getTenantModels)(req);
    const item = new FormAttributes(req.body);
    await item.save();
    res.status(201).json(item);
};
exports.createForm_attritubes = createForm_attritubes;
//# sourceMappingURL=form_attritubes.controller.js.map