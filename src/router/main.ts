import { Router } from 'express';
const router = Router();
import userRoute from './userRoute';
import categoryRoute from './categoryRoute';
import publisherRoute from './publisherRoute';
import authoRoute from './authorRoute';
import bookRoute from './bookRoute';
import cartRoute from './cartRoute';
import orderRoute from './orderRoute';
import inventoryRoute from './inventoryRoute';
import locationRoute from './locationRoute';
import reportRoute from './reportRoute';

router.use('/user', userRoute);

router.use('/category', categoryRoute);

router.use('/publisher', publisherRoute);

router.use('/author', authoRoute);

router.use('/book', bookRoute);

router.use('/cart', cartRoute);

router.use('/order', orderRoute);

router.use('/inventory', inventoryRoute);

router.use('/location', locationRoute);

router.use('/report', reportRoute);

export default router;
