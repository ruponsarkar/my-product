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
router.post("/", authMiddleware, saveProduct);
router.get("/:id", authMiddleware, getProductByIdOrSlug);
router.get("/code/:code", authMiddleware, getProductBarcodeOrSku);
router.put("/:id", authMiddleware, updateProduct);
router.get("/getLastSkuNumber/:prefix", authMiddleware, getLastSkuNumber);

// router.post("/:id/image", uploadMany.array("images", 10), addProductImages);


router.post("/deleteProductImages/:id", authMiddleware, deleteProductImages);
router.post("/:id/images", authMiddleware, uploadMany.array("images", 10), addProductImages);
// router.put("/:id/image", upload.single("image"), updateProductImage);

export default router;
