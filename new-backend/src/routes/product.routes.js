"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.get("/", product_controller_1.getProducts);
router.post("/", product_controller_1.saveProduct);
router.get("/:id", product_controller_1.getProductById);
router.put("/:id", product_controller_1.updateProduct);
// router.post("/:id/image", uploadMany.array("images", 10), addProductImages);
router.post("/:id/images", upload_middleware_1.uploadMany.array("images", 10), product_controller_1.addProductImages);
// router.put("/:id/image", upload.single("image"), updateProductImage);
exports.default = router;
//# sourceMappingURL=product.routes.js.map