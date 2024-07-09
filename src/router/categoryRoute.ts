import { Router } from 'express';
const router = Router();
import {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} from '../controller/category.controller';
import { auth, authorizeRole } from '../middleware/auth';

router.post('/create', auth, authorizeRole('admin'), createCategory);

router.get('/getall/:search', getAllCategory);

router.patch('/update', auth, authorizeRole('admin'), updateCategory);

router.delete('/delete', auth, authorizeRole('admin'), deleteCategory);

export default router;
