import form_attritubesRoutes from './form_attritubes.routes';

import formRoutes from './form.routes';

import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import productRoutes from "./product.routes";
import orderRoutes from "./order.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes); 

router.use('/forms', formRoutes);
router.use('/form_attritubess', form_attritubesRoutes);

/**
 * @openapi
 * /api/v1/:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", (req, res)=>{return 'working'});



export default router;



