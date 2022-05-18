type otpType = 'LOGIN_OTP' | 'ADMIN_LOGIN_OTP' | 'ADMIN_CREATE_PASSWORD' | 'STRIPE_AUTH_OTP';

export interface ICreateOtp {
   entityId: string;
   otp: string;
   applicationId?: string;
   entityType: string;
   type: otpType;
   expiredAt?: Date;
};

export interface ICheckDeleteOTP {
   entityId: string;
   entityType: string;
   type: otpType;
   applicationId?: string;
}

export interface IOTPEntity {
   entityId: string;
   entityType: string;
   type: otpType;
   applicationId?: string;
   timeToExpire?: number;
   callBackOnCreateOTP?: any;
}