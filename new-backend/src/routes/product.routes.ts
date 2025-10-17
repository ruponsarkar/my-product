import { Router } from "express";
import {
  getProducts,
  getProductById,
  saveProduct,
  updateProduct,
  addProductImages,
} from "../controllers/product.controller";
import { uploadMany } from "../middlewares/upload.middleware";

const router = Router();

router.get("/", getProducts);
router.post("/", saveProduct);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);

// router.post("/:id/image", uploadMany.array("images", 10), addProductImages);

/**
 * @openapi
 * /products/{id}/images:
 *   post:
 *     summary: Upload images for a product
 *     tags:
 *       - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Upload multiple image files. Field name must be 'images'"
 *               attributes:
 *                 type: string
 *                 description: >
 *                   Optional JSON string. Either:
 *                   1) object keyed by original filename -> { "photo1.jpg": { "color":["red"] } }  
 *                   2) array matching upload order -> [ { "color":["red"] }, { ... } ]
 *     responses:
 *       200:
 *         description: Images uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 */

router.post("/:id/images", uploadMany.array("images", 10), addProductImages);
// router.put("/:id/image", upload.single("image"), updateProductImage);

export default router;
