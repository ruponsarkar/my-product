"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const public_controller_1 = require("../controllers/public.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/products", public_controller_1.getPublicFeaturedProducts);
router.get("/products/:slug", public_controller_1.getPublicProductBySlug);
router.post("/auth/register", public_controller_1.registerPublicClient);
router.post("/auth/login", public_controller_1.loginPublicClient);
router.get("/auth/me", auth_middleware_1.publicClientAuthMiddleware, public_controller_1.getPublicClientSession);
router.get("/orders/my", auth_middleware_1.publicClientAuthMiddleware, public_controller_1.getMyPublicOrders);
router.post("/orders", public_controller_1.createPublicOrder);
router.delete("/orders/:id", auth_middleware_1.publicClientAuthMiddleware, public_controller_1.deletePublicOrder);
exports.default = router;
//# sourceMappingURL=public.routes.js.map