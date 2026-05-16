import { Router } from 'express';
import { allCategory, allBrands } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireSubscriptionFeature } from '../middlewares/subscription.middleware';
const router = Router();

// router.get('/', getAllCategorys);
// router.post('/', createCategory);

router.get("/", authMiddleware, requireSubscriptionFeature('products.view'), allCategory);
router.get("/brand/:category", authMiddleware, requireSubscriptionFeature('products.view'), allBrands);

export default router;
