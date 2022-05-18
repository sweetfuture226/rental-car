import dotenv from "dotenv";
import axiosCall from "../../../../utils/axiosCall";
//@ts-ignore
import { Payment, UserCampaign } from '../../../../db/models';
dotenv.config();


export const verifyStripeAuthCode = async (code: string) => {
  const clientId = process.env.STRIPE_CLIENT_ID;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  const params = {
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: secretKey,
    code: code,
  };

  const url = "https://connect.stripe.com/oauth/token";

  const res = await axiosCall({
    url,
    method: "post",
    data: params,
  })
   
  return res;
};

export const createpaymentRecord = async (payload: any) => {
  const thisPayment = await Payment.findOne({
    where: {
      id: payload.id,
    },
  });
  
  if(!thisPayment) {
     throw new Error('Invalid payment');
  };

  const amount = !isNaN(Number(payload?.amount_total)) ? payload?.amount_total / 100 : payload?.amount_total;
   await thisPayment.update({
    paymentId: payload.paymentIntent,
    amount,
    ...payload,
    status: 'SUCCESS',
  });

  if(thisPayment.campaignId) {
    await UserCampaign.update({
      paymentStatus: 'PAID',
    }, {
      where: {
        userId: thisPayment.userId,
        campaignId: thisPayment.campaignId,
      }
    });
  }

  await thisPayment.reload();

  return thisPayment;

  // success

}

export const initializePaymentRecord = async (payload: any) => {
  const newPaymentRecord = await Payment.create({
    status: 'STARTED',
    userId: payload.userId,
    campaignId: payload.campaignId,
    paymentType: 'CAMPAIGN_CHECKOUT'
  });
 
  await UserCampaign.update({
    paymentStatus: 'STARTED',
  }, {
    where: {
      userId: payload.userId,
      campaignId: payload.campaignId,
    }
  });
  return newPaymentRecord;
  // success
}

export const createFailedPaymentRecord = async (payload: any) => {
  
  const thisPayment = await Payment.findOne({
    where: {
      paymentId: payload.id,
    },
  })
  if(!thisPayment) {
     throw new Error('Invalid payment');
  };
  const amount = !isNaN(Number(payload?.amount)) ? payload?.amount / 100 : payload?.amount;
   await thisPayment.update({
    ...payload,
    amount,
    status: 'FAILED',
    paymentId: payload.payment_intent,
  });

  await UserCampaign.update({
    paymentStatus: 'UNPAID',
  }, {
    where: {
      userId: thisPayment.userId,
      campaignId: thisPayment.campaignId,
      paymentStatus: 'STARTED',
    }
  });

  thisPayment.reload();

  return thisPayment;

  // success

}