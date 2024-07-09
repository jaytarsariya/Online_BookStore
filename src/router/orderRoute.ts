import { Router } from 'express';
const router = Router();
import { createOrder } from '../controller/order.controller';
import { auth } from '../middleware/auth';

router.post('/create', auth, createOrder);

export default router;
