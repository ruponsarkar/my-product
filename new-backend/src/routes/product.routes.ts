import { Router } from "express";
import {
  getProducts,
  getProductByIdOrSlug,
  saveProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
  getProductBarcodeOrSku,
  getLastSkuNumber,
  deleteProductImages
} from "../controllers/product.controller";
import { uploadMany } from "../middlewares/upload.middleware";

import { authMiddleware } from "../middlewares/auth.middleware";
import { requireSubscriptionFeature } from "../middlewares/subscription.middleware";

const router = Router();

router.get("/", authMiddleware, requireSubscriptionFeature("products.view"), getProducts);
router.post("/", authMiddleware, requireSubscriptionFeature("products.manage"), saveProduct);
router.get("/:id", authMiddleware, requireSubscriptionFeature("products.view"), getProductByIdOrSlug);
router.get("/code/:code", authMiddleware, requireSubscriptionFeature("products.view"), getProductBarcodeOrSku);
router.put("/:id", authMiddleware, requireSubscriptionFeature("products.manage"), updateProduct);
router.delete("/:id", authMiddleware, requireSubscriptionFeature("products.manage"), deleteProduct);
router.get("/getLastSkuNumber/:prefix", authMiddleware, requireSubscriptionFeature("products.manage"), getLastSkuNumber);

// router.post("/:id/image", uploadMany.array("images", 10), addProductImages);


router.post("/deleteProductImages/:id", authMiddleware, requireSubscriptionFeature("products.manage"), deleteProductImages);
router.post("/:id/images", authMiddleware, requireSubscriptionFeature("products.manage"), uploadMany.array("images", 10), addProductImages);
// router.put("/:id/image", upload.single("image"), updateProductImage);

export default router;
