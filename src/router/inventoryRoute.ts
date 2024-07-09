import { Router } from 'express';
import {
  addStock,
  createInventory,
  getallInventory,
} from '../controller/inventory.controller';
import { auth, authorizeRole } from '../middleware/auth';
const router = Router();

router.post('/create',auth,authorizeRole('admin'), createInventory);

router.get('/getall',auth,authorizeRole('admin','seller'), getallInventory);

router.post('/addstock',auth, addStock);

export default router;
