import { Router } from 'express';
import { getAllForms, createForm } from '../controllers/form.controller';
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireSubscriptionFeature } from '../middlewares/subscription.middleware';

const router = Router();

router.get('/', authMiddleware, requireSubscriptionFeature('products.manage'), getAllForms);
router.post('/', authMiddleware, requireSubscriptionFeature('products.manage'), createForm);

export default router;
