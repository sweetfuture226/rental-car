const { parentPort } = require('worker_threads');
const Cabin = require('cabin');
const { Signale } = require('signale');
const moment = require('moment-timezone');

const { EmailSmsRecord, EmailSmsUser } = require('../../src/db/models');
const sendBulkEmail = require('../../src/services/mail/sendBulkEmail');

const cabin = new Cabin({
  axe: {
    logger: new Signale(),
  },
});

let isCancelled = false;
if (parentPort) {
  parentPort.once('message', (message) => {
    if (message === 'cancel') isCancelled = true;
  });
}

(async () => {
  const emailJobs = await EmailSmsRecord.findAll({
    where: {
      type: 'Email',
      status: 'NOT_SENT',
    },
  });

  await Promise.all(
    emailJobs.map(async (emailCampaign) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (isCancelled) return;
          if (
            moment().tz(emailCampaign.timezone).format('YYYY-MM-DD HH:mm') <
            moment(emailCampaign.scheduledTime, 'YYYY-MM-DD HH:mm').format(
              'YYYY-MM-DD HH:mm',
            )
          ) {
            console.log('It is not time yet to send email');
            resolve();
          } else {
            console.log("====It's time to send scheduled emails====");
            try {
              const userEmails = [
                ...(await EmailSmsUser.findAll({
                  where: {
                    emailSmsId: emailCampaign.id,
                  },
                  attributes: ['email'],
                  raw: true,
                })),
              ].map((user) => user?.email);

              // send email
              const resp = await sendBulkEmail(
                'QuickInfluence',
                userEmails,
                emailCampaign.message,
              );

              const messageId = resp[0].headers['x-message-id'];
              // update campaign
              await EmailSmsRecord.update(
                { status: 'SENT', meta: { sendgridMessageId: messageId } },
                { where: { id: emailCampaign.id } },
              );
            } catch (e) {
              cabin.error(e.message);
            }
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      });
    }),
  );
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
