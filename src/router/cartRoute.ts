import { Router } from 'express';
const router = Router();
import {
  addToCart,
  viewCart,
  removeProductFromCart,
  removeCart,
} from '../controller/cart.controller';
import { auth } from '../middleware/auth';

router.post('/addtocart', auth, addToCart);

router.get('/viewcart', auth, viewCart);

router.get('/remove', auth, removeProductFromCart);

router.delete('/removecart', auth, removeCart);

export default router;
