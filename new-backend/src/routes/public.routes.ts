import { Router } from "express";
import {
  createPublicOrder,
  deletePublicOrder,
  getPublicFeaturedProducts,
  getMyPublicOrders,
  getPublicProductBySlug,
  getPublicClientSession,
  loginPublicClient,
  registerPublicClient,
} from "../controllers/public.controller";
import { publicClientAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/products", getPublicFeaturedProducts);
router.get("/products/:slug", getPublicProductBySlug);
router.post("/auth/register", registerPublicClient);
router.post("/auth/login", loginPublicClient);
router.get("/auth/me", publicClientAuthMiddleware, getPublicClientSession);
router.get("/orders/my", publicClientAuthMiddleware, getMyPublicOrders);
router.post("/orders", createPublicOrder);
router.delete("/orders/:id", publicClientAuthMiddleware, deletePublicOrder);

export default router;
