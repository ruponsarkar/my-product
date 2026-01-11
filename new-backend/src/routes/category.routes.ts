import { Router } from 'express';
import { allCategory, allBrands } from '../controllers/category.controller';

const router = Router();

// router.get('/', getAllCategorys);
// router.post('/', createCategory);

router.get("/", allCategory);
router.get("/brand/:category", allBrands);

export default router;
