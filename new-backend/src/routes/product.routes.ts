import { Router } from "express";
import {
  getProducts,
  getProductByIdOrSlug,
  saveProduct,
  updateProduct,
  addProductImages,
  getProductBarcodeOrSku,
  getLastSkuNumber,
  deleteProductImages
} from "../controllers/product.controller";
import { uploadMany } from "../middlewares/upload.middleware";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.post("/", saveProduct);
router.get("/:id", getProductByIdOrSlug);
router.get("/code/:code", getProductBarcodeOrSku);
router.put("/:id", updateProduct);
router.get("/getLastSkuNumber/:prefix", getLastSkuNumber);

// router.post("/:id/image", uploadMany.array("images", 10), addProductImages);


router.post("/deleteProductImages/:id", deleteProductImages);
router.post("/:id/images", uploadMany.array("images", 10), addProductImages);
// router.put("/:id/image", upload.single("image"), updateProductImage);

export default router;
