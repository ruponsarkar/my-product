import { Router } from 'express';
import { allCategory, allBrands } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

// router.get('/', getAllCategorys);
// router.post('/', createCategory);

router.get("/", authMiddleware, allCategory);
router.get("/brand/:category", authMiddleware, allBrands);

export default router;
