require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendBulkEmail = async (subject, to, body) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_VERIFY_SENDER_EMAIL, // Change to your verified sender
      subject,
      text: body,
      html: body,
    };

    const message = await sgMail.sendMultiple(msg);

    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = sendBulkEmail;
