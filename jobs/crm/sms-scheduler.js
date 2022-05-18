const { parentPort } = require('worker_threads');
const Cabin = require('cabin');
const { Signale } = require('signale');
const moment = require('moment-timezone');

const { EmailSmsRecord, EmailSmsUser } = require('../../src/db/models');
const sendBulkSms = require('../../src/services/sms/sendBulkSms');

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
  const smsJobs = await EmailSmsRecord.findAll({
    where: {
      type: 'SMS',
      status: 'NOT_SENT',
    },
  });

  await Promise.all(
    smsJobs.map(async (smsCampaign) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (isCancelled) return;
          if (
            moment().tz(smsCampaign.timezone).format('YYYY-MM-DD HH:mm') <
            moment(smsCampaign.scheduledTime, 'YYYY-MM-DD HH:mm').format(
              'YYYY-MM-DD HH:mm',
            )
          ) {
            console.log('It is not time yet to send SMS');
            resolve();
          } else {
            console.log('==================');
            try {
              const userPhones = [
                ...(await EmailSmsUser.findAll({
                  where: {
                    emailSmsId: smsCampaign.id,
                  },
                  attributes: ['phone'],
                  raw: true,
                })),
              ].map((user) => user?.phone);

              // send SMS
              const resp = await sendBulkSms(
                userPhones,
                smsCampaign.message,
                smsCampaign.meta?.mediaUrls,
              );
              // update campaign
              await EmailSmsRecord.update(
                {
                  status: 'SENT',
                  meta: {
                    twillioSid: resp.sid,
                    dateSent: resp.dateCreated,
                    status: 'sent',
                    events: [
                      { event_name: 'sent', processed: resp.dateCreated },
                    ],
                    mediaUrls: smsCampaign.meta?.mediaUrls, // re-copy if its available
                  },
                },
                { where: { id: smsCampaign.id } },
              );
            } catch (e) {
              cabin.error(e);
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
