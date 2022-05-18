
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to: string, body: string) => {
  try {
    //add plus to phone if not exist
    const message = await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
    });

    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default sendSMS;