const twilio = require('twilio');
require('dotenv').config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const { EmailSmsUser, EmailSmsRecord, User } = require('../../db/models');

const getSmsReports = async ({ emailSmsId }) => {
  async function getUserEmails() {
    try {
      return await EmailSmsUser.findAll({
        where: {
          emailSmsId,
        },
        include: {
          model: User,
          as: 'lead',
          attributes: ['id', 'firstName', 'lastName', 'phone'],
        },
      });
    } catch (err) {
      throw err;
    }
  }

  try {
    const emailSmsRecord = await EmailSmsRecord.findOne({
      where: {
        id: emailSmsId,
      },
    });

    const messages = await client.messages.list({
      dateSent: new Date(emailSmsRecord?.meta?.dateSent),
      limit: 1000,
    });

    if (messages && messages.length > 0) {
      messages.map(async (message) => {
        await EmailSmsUser.update(
          {
            meta: {
              status: message['status'],
              events: [{ event_name: 'open', processed: message['dateSent'] }],
            },
          },
          {
            where: {
              emailSmsId,
              phone: message['to'].includes('+')
                ? message['to'].slice(1)
                : message['to'], // to remove starting +
            },
          },
        );
      });
    }

    const emailUsers = await getUserEmails();
    return emailUsers;
  } catch (error) {
    const emailUsers = await getUserEmails();
    return emailUsers;
  }
};

module.exports = getSmsReports;
