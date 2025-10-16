import { Router } from 'express';
import { getAllForm_attritubess, createForm_attritubes } from '../controllers/form_attritubes.controller';

const router = Router();

router.get('/', getAllForm_attritubess);
router.post('/', createForm_attritubes);

export default router;
