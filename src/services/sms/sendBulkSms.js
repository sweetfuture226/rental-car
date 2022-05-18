const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
const service = client.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);

const sendBulkSMS = async (to, body, media_urls = []) => {
  try {
    const bindings = to.map((number) => {
      return JSON.stringify({ binding_type: 'sms', address: number });
    });

    const message = await service.notifications.create({
      toBinding: bindings,
      body: body,
      sms: { media_urls },
    });

    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = sendBulkSMS;
