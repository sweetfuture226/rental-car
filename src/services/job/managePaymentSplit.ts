
// @ts-ignore
import { Payment, Campaign, Admin } from "../../db/models";
import rollbar from "../../utils/logger";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const BATCH_SIZE = 2;
const STRIPE_IMAGINATION_EVERYWHERE = process.env.STRIPE_IMAGINATION_EVERYWHERE;
const STRIPE_QUIK_ACTION = process.env.STRIPE_QUIK_ACTION;
const STRIPE_QUIK_INFLUENCE = process.env.STRIPE_QUIK_INFLUENCE;
const STRIPE_QUIK_SET_THE_TONE = process.env.STRIPE_QUIK_SET_THE_TONE;

const manageSplitPayment = async () => {
  // showReleaseAccounts();
  try {
    // First find paid payments/transactions that are not yet split
    const result = await Payment.findAll({
      raw: true,
      where: { status: "SUCCESS", splitStatus: null }
    });
    // Run in batches of 100
    const batch = result.slice(0, BATCH_SIZE);

    if (batch.length > 0) {
      // Process each payment in batches of 100 and update the payment type to split
      batch.forEach((payment: any) => {
        rollbar("processing payment ", payment);
        processRelease(payment);
      });
    }

    return result;
  } catch (error: any) {
    rollbar("Sequalize error ", error);
  }
};

const processRelease = async (payment: any) => {
  const balance = await stripeBalanceFunction();
  if (balance.available > parseInt(payment.amount, 10) * 100) {
    // Calculate shares and the amount to release
    const totalAmount = parseInt(payment.amount, 10) * 100;
    const feeToQuikAction = Math.round(totalAmount * 0.03) / 100;
    const feeToQuikSetTheTone = Math.round(totalAmount * 0.03) / 100;
    const feeToImaginationEveryWhere = Math.round(totalAmount * 0.03) / 100;
    const feeToQuikInfluence = Math.round(totalAmount * 0.03) / 100;
    const feeToCampaignCreator = Math.round(totalAmount * 0.88) / 100;

    try {
      const { id, currency } = payment;
      const campaignCreatorStripeAcctId = await getCampaignCreatorStripeAcctId(
        payment
      );
      // Then payout to the admin users and stake holders
      const payoutData = {
        id,
        amount: totalAmount,
        currency,
        quikAction: {
          amount: feeToQuikAction,
          destination: STRIPE_QUIK_ACTION,
          description: `Payout to Quik Action`
        },
        quikSetTheTone: {
          amount: feeToQuikSetTheTone,
          destination: STRIPE_QUIK_SET_THE_TONE,
          description: `Payout to Quik Set the Tone`
        },
        quikInfluence: {
          amount: feeToQuikInfluence,
          destination: STRIPE_QUIK_INFLUENCE,
          description: `Payout to Quik Influence`
        },
        quikImaginationEverywhere: {
          amount: feeToImaginationEveryWhere,
          destination: STRIPE_IMAGINATION_EVERYWHERE,
          description: `Payout to Quik Imagination Everywhere`
        },
        campaignCreator: {
          amount: feeToCampaignCreator,
          destination: campaignCreatorStripeAcctId,
          description: `Payout to Campaign Creator`
        }
      };

      await payout(payoutData);
    } catch (error: any) {
      rollbar("Sequalize error ", error);
    }
    return;
  }
};

const payout = async (payoutData: any) => {
  const {
    currency,
    quikAction,
    quikSetTheTone,
    quikInfluence,
    quikImaginationEverywhere,
    campaignCreator
  } = payoutData;
  const payoutDataArray = [
    quikAction,
    quikSetTheTone,
    quikInfluence,
    quikImaginationEverywhere,
    campaignCreator
  ];
  try {
    const promises = payoutDataArray.map((payout: any) => {
      return transfer(
        payout.amount,
        currency,
        payout.destination,
        payout.description
      );
    });
    const _promises = await Promise.all(promises);
    if (_promises.length >= payoutDataArray.length) {
      await Payment.update(
        {
          splitStatus: true
        },
        { where: { id: payoutData.id } }
      ).then(() => console.log("Payment Updated", payoutData.id));
    }
    return;
  } catch (error: any) {
    console.log("Sequalize error >>> ", error);
    rollbar("Sequalize error ", error);
  }
};

const getCampaignCreatorStripeAcctId = async (payment: any) => {
  const { campaignId } = payment;

  //@ts-ignore
  const { ownerId } = await Campaign.findOne({
    raw: true,
    where: { id: campaignId }
  });

  //@ts-ignore
  const { stripeAcctId } = await Admin.findOne({
    raw: true,
    where: { id: ownerId }
  });
  return stripeAcctId;
};

const showReleaseAccounts = () => {
  console.log(`BATCH_SIZE: ${BATCH_SIZE}`);
  console.log(`STRIPE_QUIK_INFLUENCE: ${STRIPE_QUIK_INFLUENCE}`);
  console.log(`STRIPE_QUIK_SET_THE_TONE: ${STRIPE_QUIK_SET_THE_TONE}`);
  console.log(`QUIK_ACTION: ${STRIPE_QUIK_ACTION}`);
  console.log(`IMAGINATION_EVERYWHERE: ${STRIPE_IMAGINATION_EVERYWHERE}`);
  rollbar(`Cron Job Configuration Info`, {
    stripe: {
      quikInfluence: STRIPE_QUIK_INFLUENCE,
      quikSetTheTone: STRIPE_QUIK_SET_THE_TONE,
      quikAction: STRIPE_QUIK_ACTION,
      imaginationEveryWhere: STRIPE_IMAGINATION_EVERYWHERE
    },
    batchSize: BATCH_SIZE
  });
};

export async function stripeBalanceFunction() {
  const balance = await stripe.balance.retrieve();
  const available = balance?.available[0]?.amount || 0;
  const pending = balance?.pending[0]?.amount || 0;
  return {
    available,
    pending,
    livemode: balance?.livemode
  };
}

export const transfer = async (
  amount: any,
  currency: string,
  destination: any,
  description: any
) => {
  if (!destination) return false;

  const actualAmount = amount.toString().includes(".")
    ? amount.toString().replace(".", "")
    : amount;

  const acd = await stripe.accounts.retrieveCapability(
    destination,
    "transfers"
  );

  if (!acd || acd.status !== "active") {
    console.log(
      "Your destination account needs to have at least one of the following capabilities enabled: transfers, legacy_payments",
      destination
    );
    rollbar(
      "Your destination account needs to have at least one of the following capabilities enabled: transfers, legacy_payments",
      {
        amount: actualAmount,
        destination,
        description
      }
    );
    return false;
  }

  const result = await stripe.transfers.create({
    amount: actualAmount,
    currency,
    destination,
    description
  });

  console.log("Transfer succeeded: ", result);
  console.log("\n");
  rollbar("Transfer succeeded: ", result);
  return true;
};

export default manageSplitPayment;
