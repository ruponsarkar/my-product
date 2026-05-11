"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allBrands = exports.allCategory = void 0;
const tenant_service_1 = require("../services/tenant.service");
const allCategory = async (req, res) => {
    try {
        const { Product } = await (0, tenant_service_1.getTenantModels)(req);
        const data = await Product.distinct("category");
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
        const { Product } = await (0, tenant_service_1.getTenantModels)(req);
        const data = await Product.distinct("brand", { category });
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
};
exports.allBrands = allBrands;
//# sourceMappingURL=category.controller.js.map