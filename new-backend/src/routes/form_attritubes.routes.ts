import { Router } from 'express';
import { getAllForm_attritubess, createForm_attritubes } from '../controllers/form_attritubes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', authMiddleware, getAllForm_attritubess);
router.post('/', authMiddleware, createForm_attritubes);

export default router;
