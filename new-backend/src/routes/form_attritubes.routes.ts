import { Router } from 'express';
import { getAllForm_attritubess, createForm_attritubes } from '../controllers/form_attritubes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireSubscriptionFeature } from '../middlewares/subscription.middleware';
const router = Router();

router.get('/', authMiddleware, requireSubscriptionFeature('products.manage'), getAllForm_attritubess);
router.post('/', authMiddleware, requireSubscriptionFeature('products.manage'), createForm_attritubes);

export default router;
