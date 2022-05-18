import { UserDBService } from './../users/index';
import querystring from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import { OtpServices, IOTPEntity } from './../otp/index';
import dotenv from 'dotenv';
import { AdminDBService } from '../admin/index';
import AuthMiddleware from '../auth/middleware';

dotenv.config();

import { Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import AuthService from './dbService';
import AdminController from '../admin/controller';
import JWT from '../../../../utils/jwt';
import { ApplicationDBService } from '../application';

class Auth {
  static async getOTpforAdminLogin(req: IRequest, res: Response) {
    try {
      // check if admin already exist on db
      const thisAdmin = await AdminDBService.getAdmin({
        email: req.body.email,
      });
      if (!thisAdmin) {
        return ApiResponse.error(res, 400, 'Admin does not exist');
      }
      const otp = await OtpServices.createOtpForAdminLogin({
        entityId: thisAdmin.id,
        adminInfo: thisAdmin,
      });
      return ApiResponse.success(res, 200, 'OTP sent successfully', otp);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async AdminLoginOtp(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      const thisAdmin = await AdminDBService.getAdmin({
        email: req.body.email,
      });
      if (!thisAdmin) {
        return ApiResponse.error(res, 400, 'User does not exist');
      }

      const otpPayload: IOTPEntity = {
        entityId: thisAdmin.id,
        type: 'ADMIN_LOGIN_OTP',
        entityType: 'admin',
      };

      const otp = await OtpServices.validateOTP(otpPayload, req.body.otp);
      if (!otp) {
        return ApiResponse.error(res, 400, 'OTP does not exist');
      }
      // clear otp
      await OtpServices.checkDeleteExistingOtp(otpPayload);
      const token = await JWT.sign(thisAdmin.dataValues);

      AuthMiddleware.addTokenToCookie(res, token);

      return ApiResponse.success(res, 200, 'Admin logged in successfully', {
        admin: thisAdmin,
        token,
      });
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async AdminLoginPassword(req: IRequest, res: Response) {
    return AdminController.loginAdmin(req, res);
  }

  static async AdminRegisterOTP(req: IRequest, res: Response) {
    try {
      // checkApplicationId before creating admin
      if (req.body.applicationId) {
        const thisApp = await ApplicationDBService.getApplication({
          id: req.body.applicationId,
        });
        if (!thisApp) {
          return ApiResponse.success(
            res,
            400,
            'Application id is invalid',
            null,
          );
        }
      }

      // check if user already exist on db
      let thisAdmin = await AdminDBService.getAdmin({ email: req.body.email });
      if (thisAdmin) {
        if (req.body.applicationId) {
          const adminApp = await ApplicationDBService.getAdminApplication(
            req.body.applicationId,
            thisAdmin.id,
          );
          if (adminApp) {
            return ApiResponse.error(
              res,
              400,
              'Admin for Application already exists',
            );
          } else {
          }
        } else {
          return ApiResponse.success(res, 400, 'Admin already exists', null);
        }
      } else {
        thisAdmin = await AdminDBService.createAdmin(
          req.body,
          req.body.internalRole || 'default',
        );
      }

      // if applicationId is passed in req.body
      if (req.body.applicationId) {
        await ApplicationDBService.addAdminToApplication(
          req.body.applicationId,
          thisAdmin.id,
        );
      }
      // generate otp for admin login
      const otp = await OtpServices.createOtpForAdminLogin({
        entityId: thisAdmin.id,
        adminInfo: thisAdmin,
      });
      const randomOTP = await OtpServices.createOtpForAdminStripe({
        entityId: thisAdmin.id,
      });

      const generatedToken = await JWT.sign({
        otp: randomOTP,
        adminId: thisAdmin.id,
      });

      const state = uuidv4();
      // stripe redirect setup
      let stripeConnectParams = {
        response_type: 'code',
        scope: 'read_write',
        state: generatedToken,
        client_id: process.env.STRIPE_CLIENT_ID,
        redirect_uri: `${process.env.STRIPE_REDIRECT_URI}?token=${generatedToken}`,
      };
      //Todo: to do change stringify connect params into url in more elegant way
      const suggestedCapabilities =
        'suggested_capabilities[]=transfers&suggested_capabilities[]=card_payments';
      const stripeUser = `stripe_user[email]=${
        thisAdmin.email
      }&=stripe_user[country]=${'US'}&stripe_user[first_name]=${
        thisAdmin.firstName
      }&stripe_user[last_name]=${thisAdmin.lastName}`;
      let reqQuery = querystring.stringify(stripeConnectParams);
      const url = `https://connect.stripe.com/express/oauth/authorize?${reqQuery}&${suggestedCapabilities}&${stripeUser}`;

      return ApiResponse.success(res, 200, 'OTP sent successfully', {
        url,
      });
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async RequestPasswordChangeOTP(req: IRequest, res: Response) {
    try {
      if (req.decoded.password !== '##') {
        return ApiResponse.error(
          res,
          400,
          'Password has already been created. Please Change your password instead',
        );
      }
      const otp = await OtpServices.createOtpForAdminChangePassword({
        entityId: req.decoded.id,
      });
      return ApiResponse.success(res, 200, 'OTP sent successfully', otp);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async CreatePassword(req: IRequest, res: Response) {
    try {
      const otpPayload: IOTPEntity = {
        entityId: req.decoded.id,
        type: 'ADMIN_CREATE_PASSWORD',
        entityType: 'admin',
      };
      const otp = await OtpServices.validateOTP(otpPayload, req.body.otp);
      if (!otp) {
        return ApiResponse.error(res, 400, 'OTP does not exist');
      }
      // clear otp
      await OtpServices.checkDeleteExistingOtp(otpPayload);

      //  change admin password
      await AdminDBService.updateAdminPassword(
        { rawPassword: req.body.password, adminId: req.decoded.id },
        false,
      );

      return ApiResponse.success(res, 200, 'Password created successfully', {});
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAdminProfile(req: IRequest, res: Response) {
    try {
      const profile = await AdminDBService.getAdminProfile({ id: req?.decoded?.id })
      return ApiResponse.success(res, 200, 'Admin profile', profile);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getUserProfile(req: IRequest, res: Response) {
    try {
      return ApiResponse.success(
        res,
        200,
        'User retrieved successfully',
        req.decodedUser,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateUserProfile(req: IRequest, res: Response) {
    try {
      const userUpdate = await UserDBService.updateUser(req.decodedUser.id, req.body);
      const getUpdatedUser = await UserDBService.getUserById(req.decodedUser.id);
      return ApiResponse.success(
        res,
        200,
        'User retrieved successfully',
        getUpdatedUser,
      )
    } catch (error) {
      console.log(error)
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateAdminProfile(req: IRequest, res: Response) {
    try {
      await AdminDBService.updateAdmin(req.decoded.id, req.body)
      const admin = await AdminDBService.getAdminProfile({ id : req.decoded.id});
      return ApiResponse.success(
        res,
        200,
        'Admin retrieved successfully',
        admin,
      )
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAdminPermissions(req: IRequest, res: Response) {
    try {
      if(!req?.decoded?.roleId) {
        return ApiResponse.error(res, 400, 'Admin does not have any permissions');
      }
      const permissions = await AdminDBService.getRolePermissions(req.decoded.roleId);

      const cleaned = permissions?.map?.(permission => permission?.Permission?.name ) || []
      return ApiResponse.success(res, 200, 'Admin permissions', {userId: req.decoded.id, role: req?.decoded?.role?.name, permissions: cleaned});
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }
}

export default Auth;
