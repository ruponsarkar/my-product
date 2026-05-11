"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForm = exports.getAllForms = void 0;
const tenant_service_1 = require("../services/tenant.service");
const getAllForms = async (req, res) => {
    const { Form } = await (0, tenant_service_1.getTenantModels)(req);
    const data = await Form.find();
    res.json(data);
};
exports.getAllForms = getAllForms;
const createForm = async (req, res) => {
    const { Form } = await (0, tenant_service_1.getTenantModels)(req);
    const item = new Form({ ...req.body, createdBy: req.user.id });
    await item.save();
    res.status(201).json(item);
};
exports.createForm = createForm;
//# sourceMappingURL=form.controller.js.map