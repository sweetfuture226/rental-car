/* eslint-disable indent */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Email from 'email-templates';
import sgTransport from 'nodemailer-sendgrid-transport';

dotenv.config();

const senderEmail = process.env.SERVER_MAIL;
const renderPath = 'src/services/mail/';

var options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
};

const transporter = nodemailer.createTransport(sgTransport(options));

/* istanbul ignore next */
/**
 * @Module Mailer
 * @description Controlls all the mail based activities
 */
class Mailer {
  /**
   * Malier class constructor
   * @param {Object} mailObject - the mailer Object
   * @param {String} mailObject.to - the user the email should go to
   * @param {String} mailObject.message - the message to be sent to the user
   * @param {Boolean} mailObject.iButton - to add a button
   * @param {Boolean} mailObject.template - to add additional user templastes
   * @static
   */

  to: string;
  iButton: boolean;
  iTemplate: boolean;
  subject: string;
  data: any;
  emailTemplate: string = 'jade';

  constructor(mailObject) {
    const { to, subject, iButton, iTemplate, data, emailTemplate } = mailObject;
    this.to = to;
    this.iButton = iButton || false;
    this.iTemplate = iTemplate || false;
    this.subject = subject;
    this.data = data;
    this.emailTemplate = emailTemplate || this.emailTemplate;

    console.log('Email service started');
  }

  renderEmails() {
    const email = new Email();

    email.render('booking_confirmation', {});
    return this;
  }

  /**
   * Email trasporter
   * @param {String} to - Reciever email
   * @param {String} from - Sender email
   * @param {String} subject - Email subject
   * @param {String} html - Email body
   * @returns  {Object} - Mailer response
   */
  async sendMail() {
    const email = new Email({
      message: {
        from: senderEmail,
      },
      send: true,
      transport: transporter,
      views: {
        root: renderPath,
        options: {
          extension: this.emailTemplate, // <---- HERE
        },
      },
      juiceResources: {
        webResources: {
          relativeTo: renderPath,
        },
      },
    });

    try {
      await email.send({
        template: this.iTemplate,
        message: {
          to: this.to,
          subject: this.subject,
        },
        locals: {
          locale: 'en',
          ...this.data,
        },
      });

      console.log(`Message Sent! to ${this.to}`);
    } catch (err) {
      console.log(err);
    }
  }
}

export default Mailer;
