import { Router } from "express";
import { getProfile, listUsers, createUser, updateUser } from "../controllers/user.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";
import { requireSubscriptionFeature } from "../middlewares/subscription.middleware";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.get("/", authMiddleware, authorizeRoles("admin"), requireSubscriptionFeature("users.manage"), listUsers);
router.post("/", authMiddleware, authorizeRoles("admin"), requireSubscriptionFeature("users.manage"), createUser);
router.put("/:id", authMiddleware, authorizeRoles("admin"), requireSubscriptionFeature("users.manage"), updateUser);

export default router;
