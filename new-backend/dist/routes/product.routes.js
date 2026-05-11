"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, product_controller_1.getProducts);
router.post("/", auth_middleware_1.authMiddleware, product_controller_1.saveProduct);
router.get("/:id", auth_middleware_1.authMiddleware, product_controller_1.getProductByIdOrSlug);
router.get("/code/:code", auth_middleware_1.authMiddleware, product_controller_1.getProductBarcodeOrSku);
router.put("/:id", auth_middleware_1.authMiddleware, product_controller_1.updateProduct);
router.get("/getLastSkuNumber/:prefix", auth_middleware_1.authMiddleware, product_controller_1.getLastSkuNumber);
// router.post("/:id/image", uploadMany.array("images", 10), addProductImages);
router.post("/deleteProductImages/:id", auth_middleware_1.authMiddleware, product_controller_1.deleteProductImages);
router.post("/:id/images", auth_middleware_1.authMiddleware, upload_middleware_1.uploadMany.array("images", 10), product_controller_1.addProductImages);
// router.put("/:id/image", upload.single("image"), updateProductImage);
exports.default = router;
//# sourceMappingURL=product.routes.js.map