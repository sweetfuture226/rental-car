import express from 'express';
import application from './application';
import eventRouter from './event';
import userRouter from './user';
import adminRouter from './admin';
import uiContentRouter from './uicontent';
import authRouter from './auth';
import organizationRouter from './organization';
import stripeRouter from './stripe';

const router = express.Router();

router.use('/application', application);
router.use('/users', userRouter);
router.use('/event', eventRouter);
router.use('/admin', adminRouter);
router.use('/content', uiContentRouter);
router.use('/auth', authRouter);
router.use('/organization', organizationRouter);
router.use('/stripe', stripeRouter);
router.use('/test', (req, res) => res.json({ status: "Testing complete" }));

export default router;
