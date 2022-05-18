import { getExpiryTimeInMins } from './../../../../utils/helpers';
// @ts-ignore
import { Otp } from '../../../../db/models';
import { ICreateOtp, ICheckDeleteOTP, IOTPEntity } from './types';
import crypto from 'crypto';
import Mailer from '../../../../services/mail/email';
import sendSMS from '../../../../services/sms/sendSms';



class OtpService {
  static hashOTP (otp: string): string {
    // hash otp with node crypto
    const hash = crypto.createHash('sha256');
    return hash.update(otp).digest('hex');
  }
  static generateRandomOtp (): {hashed: string; otp: string} {
    let otp;
    if(process.env.STATIC_OTP) {
     otp = process.env.STATIC_OTP; 
    } else {
      otp = Math.floor(1000 + Math.random() * 9000);
    }
    return {hashed: OtpService.hashOTP(otp.toString()), otp};
  }

  static async createOtp (otpPayload: ICreateOtp) {
      // crrate otp
      const created = await Otp.create(otpPayload);
      return created;
  }

  static async validateOTP ({  entityId, entityType, type, applicationId }: IOTPEntity, otp: string) {
    const otpHashed = OtpService.hashOTP(`${otp}`);
    const thisOtp = await Otp.findOne({ where: { entityId, entityType, type, otp: otpHashed, ...(applicationId ? { applicationId }: {}) } });
    if(thisOtp) {
      const timeNow = Date.now();
      if(new Date(thisOtp.expiredAt).getTime() > timeNow) {
        return thisOtp;
      }
      throw new Error('OTP Expired');
    }

    throw new Error('Invalid OTP');
  }

  static async checkDeleteExistingOtp ({ entityId, entityType, type, applicationId }: ICheckDeleteOTP) {
    const otp = await Otp.findOne({
      where: { entityId, entityType, type, ...(applicationId ? {applicationId} : {}) }
    });
    if(otp) {
      await Otp.destroy({ where: { id: otp.id } });
    }
  }

  static async createOtpForEntity ({ entityId, applicationId, entityType, type, timeToExpire, callBackOnCreateOTP }: IOTPEntity) {
    const contatinAppId = applicationId ? {applicationId} : {};
    await OtpService.checkDeleteExistingOtp({ entityId, entityType, type, ...contatinAppId });
    const {otp, hashed} = OtpService.generateRandomOtp();

    const otpPayload: ICreateOtp = {
      entityId,
      entityType,
      type,
      applicationId,
      otp: hashed,
      expiredAt: getExpiryTimeInMins(timeToExpire)
    };

        // send otp to email or phone
 

    const created = await OtpService.createOtp(otpPayload);
    const otpTime = Math.round((new Date(created.expiredAt).getTime() - new Date(created.createdAt).getTime())/60000);
    const otpTimeToExpire = `${otpTime} mins`;
    const result = {otpTimeToExpire, expiredAt: new Date(created.expiredAt).getTime()};
    if(callBackOnCreateOTP) {
      callBackOnCreateOTP({otp, ...result})
     }
    return result
  }

  static async createOtpForUserLogin ({ entityId, applicationId, userInfo }) {
    const sendLoginOTP = async ({otp, otpTimeToExpire}) => {
      const sent = await sendSMS(userInfo?.phone, `Your Quik Influence verification code is: ${otp}. Don't share this code with anyone our employees will never ask for the code.`)
    }
    return OtpService.createOtpForEntity({
      entityId,
      entityType: 'user',
      type: 'LOGIN_OTP',
      applicationId,
      callBackOnCreateOTP: sendLoginOTP
    })
  }

  static async createOtpForAdminLogin ({ entityId, adminInfo }) {
    const sendLoginOTP = ({otp, otpTimeToExpire}) => {
      const mail = new Mailer({
        to: adminInfo?.email,
        data: {
          firstName: adminInfo?.firstName,
          expireyFormat: `in ${otpTimeToExpire}`,
          token: otp,
        },
        iTemplate: 'otp_email',
        subject: `Quik Influence One Time Password to complete Login for ${adminInfo?.firstName}`,
        emailTemplate: 'ejs',
      });

      mail.sendMail();
    }

    return OtpService.createOtpForEntity({
      entityId,
      entityType: 'admin',
      type: 'ADMIN_LOGIN_OTP',
      callBackOnCreateOTP: sendLoginOTP
    })
  }

  static async createOtpForAdminChangePassword ({ entityId }) {
    return OtpService.createOtpForEntity({
      entityId,
      entityType: 'admin',
      type: 'ADMIN_CREATE_PASSWORD',
    })
  }

  static async createOtpForStripeEntity ({ entityId, entityType, type, timeToExpire }: any) {
    await OtpService.checkDeleteExistingOtp({ entityId, entityType, type });
    const {otp, hashed} = OtpService.generateRandomOtp();

    const otpPayload: ICreateOtp = {
      entityId,
      entityType,
      type,
      otp: hashed,
      expiredAt: getExpiryTimeInMins(timeToExpire)
    };

        // send otp to email or phone
    const created = await OtpService.createOtp(otpPayload);
    const otpTime = Math.round((new Date(created.expiredAt).getTime() - new Date(created.createdAt).getTime())/60000);
    const otpTimeToExpire = `${otpTime} mins`;
    return { otp };
  }

  static async createOtpForAdminStripe ({ entityId }) {
    return OtpService.createOtpForStripeEntity({
      entityId,
      entityType: 'admin',
      type: 'STRIPE_AUTH_OTP',
      timeToExpire: 100
    })
  }
}

export default OtpService;