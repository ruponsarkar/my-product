import { Router } from "express";
import { getProducts, getProductById, saveProduct, updateProduct, addProductImages } from "../controllers/product.controller";
import { uploadMany } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getProducts);
router.post("/", saveProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);

// router.post("/:id/image", uploadMany.array("images", 10), addProductImages);
router.post("/:id/images", uploadMany.array("images", 10), addProductImages);
// router.put("/:id/image", upload.single("image"), updateProductImage);


export default router;
