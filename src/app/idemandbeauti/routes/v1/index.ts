import express from 'express';
import ApiResponse from '../../../../utils/response';
import authRouter from './auth';
import orderRouter from './order';
import productRouter from './product';
import storeRouter from './store';

const router = express.Router();

router.get('/', (req, res) => {
  return ApiResponse.success(res, 200, 'Welcome to idemandbeauti');
});

router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/store', storeRouter);
router.use('/order', orderRouter);


export default router;
