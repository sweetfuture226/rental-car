import express from 'express';
import ApiResponse from '../../../../utils/response';
import authRouter from './auth';

const router = express.Router();

router.get('/', (req, res) => {
  ApiResponse.success(res, 200, 'Welcome to quiksession');
});

router.use('/auth', authRouter);

export default router;
