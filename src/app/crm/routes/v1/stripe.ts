import express from 'express';
import { StripeController, StripeValidator } from '../../modules/stripe';

const stripeRouter = express.Router();

stripeRouter.post(
  '/create-payment-session',
  StripeValidator.createSession,
  StripeController.createSession,
);

stripeRouter.get(
  '/redirect',
  StripeController.stripeSetup,
);

stripeRouter.post(
  '/webhook',
  StripeController.stripeWebHook,
);

export default stripeRouter;
