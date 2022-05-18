require('dotenv').config();
const sgClient = require('@sendgrid/client');

const { EmailSmsUser, User } = require('../../db/models');

sgClient.setApiKey(process.env.SENDGRID_API_KEY);

const getEmailReports = async ({ emailSmsId, sendgridMessageId }) => {
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
    const queryParams = {
      query: `(msg_id LIKE "%${sendgridMessageId}%")`,
      limit: 1000, // Max according to SendGrid API docs.
    };

    const request = {
      url: `/v3/messages`,
      method: 'GET',
      qs: queryParams,
    };

    const [_, body] = await sgClient.request(request);

    if (body && body.messages && body.messages.length > 0) {
      // make concurrent api calls
      const requests = body.messages.map((message) => {
        const payload = {
          url: `/v3/messages/${message.msg_id}`,
          method: 'GET',
        };
        return sgClient.request(payload);
      });

      // wait until all the api calls resolves
      const result = await Promise.all(requests);

      // posts are ready. accumulate all the posts without duplicates
      result.map(async (item) => {
        const [_, body] = item;

        // Update EmailSmsUser
        if (!body) return;

        await EmailSmsUser.update(
          { meta: { status: body['status'], events: body['events'] } },
          {
            where: {
              emailSmsId,
              email: body['to_email'],
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

module.exports = getEmailReports;
