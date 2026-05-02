import { Router } from 'express';
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware';
import { getTenantSettings, updateTenantSettings } from '../controllers/settings.controller';

const router = Router();

router.get('/', authMiddleware, getTenantSettings);
router.put('/', authMiddleware, authorizeRoles('admin'), updateTenantSettings);

export default router;
