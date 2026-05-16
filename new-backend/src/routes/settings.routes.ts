import { Router } from 'express';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';
import { getTenantSettings, updateTenantSettings } from '../controllers/settings.controller';
import { requireSubscriptionFeature } from '../middlewares/subscription.middleware';

const router = Router();

router.get('/', authMiddleware, requireSubscriptionFeature('settings.manage'), getTenantSettings);
router.put('/', authMiddleware, authorizeRoles('admin'), requireSubscriptionFeature('settings.manage'), updateTenantSettings);

export default router;
