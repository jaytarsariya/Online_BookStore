import { Router } from 'express';
const router = Router();
import {
  viewAllOrdersOfPerticularUser,
  viewOrderWithDateRange,
  viewOrderReport,
} from '../controller/report.controller';
import { auth, authorizeRole } from '../middleware/auth';

router.get('/view-all-user-orders', auth,authorizeRole('admin'), viewAllOrdersOfPerticularUser);

router.get('/view-with-range', auth,authorizeRole('admin'), viewOrderWithDateRange);

router.get('/order-report', auth,authorizeRole('admin'),viewOrderReport);

export default router;
