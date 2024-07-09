import { Router } from 'express';
const router = Router();
import {
  createUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controller/user.controller';
import { auth, authorizeRole } from '../middleware/auth';

router.post('/create', createUser);

router.post('/login', loginUser);

router.get('/getall', auth, getAllUsers);

router.patch('/update', auth, authorizeRole('admin'), updateUser);

router.delete('/delete', auth, authorizeRole('admin'), deleteUser);

export default router;
