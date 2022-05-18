import { OtpServices } from './../otp/index';
import { Response } from 'express';
import Stripe from 'stripe';
import { IRequest } from '../../../../utils/joiSetup';
import JWT from '../../../../utils/jwt';
import logger from '../../../../utils/logger';
import ApiResponse from '../../../../utils/response';
import AdminService from '../admin/dbService';
import OtpService from '../otp/services';
import { createFailedPaymentRecord, createpaymentRecord, initializePaymentRecord, verifyStripeAuthCode } from './services';
import dotenv from 'dotenv';
import UserService from '../users/dbService';
import { attachHttpToLink } from '../../../../utils/helpers';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const stripeObj = require('stripe');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
class Auth {
  static async createSession(req: IRequest, res: Response) {
    try {
    const { email, image, title, amount, campaignId } = req.body;

    const thisUser = await UserService.getUserByEmail(email);
    if(!thisUser) {
      return ApiResponse.error(res, 400, 'User does not exist');
    };

    const thisCampaign = await UserService.getCampaign({ id: campaignId });
    if(!thisCampaign) {
      return ApiResponse.error(res, 400, 'Campaign does not exist');
    };
    // register the checkout payment
    const paymentRec = await initializePaymentRecord({userId: thisUser.id, campaignId});
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      metadata: {
        campaignId,
        userId: thisUser.id,
        internalPaymentId: paymentRec.id,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              images: [image],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: attachHttpToLink(thisCampaign.redirectUrl || `${process.env.FRONTEND_URL}/campaign/${campaignId}?success=true`) ,
      cancel_url: `${process.env.FRONTEND_URL}/campaign/${campaignId}?cancel=true`,
    });
    const amountInt = !isNaN(Number(session?.amount_total)) ? Number(session?.amount_total)/100 : amount;
    await paymentRec.update({
      paymentId: session.payment_intent,
      amount: amountInt
    })
    return ApiResponse.success(res, 200, 'Successful', session);
    } catch (error) {
      console.log(error);
      return ApiResponse.error(res, 400, error.message);
    }

  }

  static async stripeSetup (req: IRequest, res: Response)  {
    // logger('connect stripe requested', req);
    try {
      const { code, state } = req.query;
      // console.log('req.query >>>>> ', req.query);
      if(!code || !state) {
        return ApiResponse.error(res, 400, 'Invalid request');
      }
      /*
        TODO: Update this make the request to get stripe user ID
      */
      const authResp = await verifyStripeAuthCode(code as string);
      // console.log('stripe authorization result >>> ', authResp);
      if (authResp.error) {
        logger(authResp.error_description);
        logger('error==>', authResp.error_description, authResp);
        //@ts-ignore
        return ApiResponse.error(res, 400, authResp.error_description);
      }
      
      const stripeAcctId: string = authResp.stripe_user_id;
      if (!stripeAcctId) {
        logger('Unknown Error stripe account id is null', authResp);
        return ApiResponse.error(res, 400, 'Unknown Error');
      }
       const decodedToken = await JWT.verify(state);

      const otp = await OtpService.validateOTP({
        entityId: decodedToken.adminId,
        type: 'STRIPE_AUTH_OTP',
        entityType: 'admin'
       } , decodedToken.otp.otp);

       if(!otp) {
        return ApiResponse.error(res, 400, 'OTP does not exist');
      }
      // clear otp 
      await OtpServices.checkDeleteExistingOtp({ 
        entityId: decodedToken.adminId, 
        applicationId: null, 
        type: 'STRIPE_AUTH_OTP', 
        entityType: 'admin' 
      });

       // @ts-ignore
      await AdminService.updateAdmin(decodedToken.adminId, { stripeAcctId });
      // return ApiResponse.success(res, 200, 'Successful', { });
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  };

  static async stripeWebHook (req: IRequest, res: Response)  {
    // logger('connect stripe requested', req);
    try {
      const sig = req.headers['stripe-signature'];
      const event = stripeObj.webhooks.constructEvent(req.body, sig, endpointSecret);

      if(event.type === 'checkout.session.completed') {
        const paymentObj = event.data.object;
        const { amount, currency, metadata, payment_intent, ...rest } = paymentObj;
        const { campaignId, userId, internalPaymentId } = metadata;
        const payment = {
          amount,
          currency,
          campaignId,
          userId,
          meta: event,
          paymentIntent: payment_intent,
          ...rest,
          id: internalPaymentId,
        };
        await createpaymentRecord(payment);
        return ApiResponse.success(res, 200, 'Successful', { });
      } 
      else if(event.type === 'payment_intent.payment_failed') {
        await createFailedPaymentRecord(event.data.object);
        return ApiResponse.success(res, 200, 'Successful', {
          message: 'Payment failed',
        });
      }
      else {
        console.log('Unknown Event', event);
      }
      return ApiResponse.success(res, 200, 'Successful', {
        message: 'Unknown Event',
      });
    } catch (error) {
      console.log('error >>> ', error);
      return ApiResponse.error(res, 400, error.message);
    }
  };
}

export default Auth;
