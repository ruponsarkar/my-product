import { Router } from 'express';
import { getAllForms, createForm } from '../controllers/form.controller';
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get('/', getAllForms);
router.post('/', authMiddleware, createForm);

export default router;
