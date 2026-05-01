import { Router } from "express";
import { getProfile, listUsers, createUser, updateUser } from "../controllers/user.controller";
import { authMiddleware, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.get("/", authMiddleware, authorizeRoles("admin"), listUsers);
router.post("/", authMiddleware, authorizeRoles("admin"), createUser);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateUser);

export default router;
