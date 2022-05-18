import { UserValidation } from './../../modules/users/index';
import express from 'express';
import { AuthController, AuthMiddleware, AuthValidation } from '../../modules/auth';
import AdminValidation from '../../modules/admin/validations';

const authRouter = express.Router();

authRouter.post(
  '/admin/login',
  AuthValidation.loginAdminPassword,
  AuthController.AdminLoginPassword
);

authRouter.post(
  '/admin/getLoginOtp',
  AuthValidation.getOTPForLogin,
  AuthController.getOTpforAdminLogin
)

authRouter.post(
  '/admin/otpLogin',
  AuthValidation.loginAdminOTP,
  AuthController.AdminLoginOtp
)

authRouter.post(
  '/admin/otpRegister',
  AuthValidation.registerAdminOTP,
  AuthController.AdminRegisterOTP
);

authRouter.get(
  '/admin/getPasswordChangeOtp',
  AuthMiddleware.AdminTokenAuth,
  AuthController.RequestPasswordChangeOTP
);

authRouter.post(
  '/admin/createPassword',
  AuthMiddleware.AdminTokenAuth,
  AuthValidation.createPassword,
  AuthController.CreatePassword
);

authRouter.post(
  '/admin/internalRegister',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_register_app_owners'),
  AuthValidation.registerAdminInternal,
  AuthMiddleware.attachAppOwnerRole,
  AuthController.AdminRegisterOTP
);

authRouter.get(
  '/profile/admin',
  AuthMiddleware.AdminTokenAuth,
  AuthController.getAdminProfile
);

authRouter.get(
  '/permissions/admin',
  AuthMiddleware.AdminTokenAuth,
  AuthController.getAdminPermissions
);

authRouter.get(
  '/profile/user',
  AuthMiddleware.UserTokenAuth,
  AuthController.getUserProfile
);

authRouter.put(
  '/profile/user',
  AuthMiddleware.UserTokenAuth,
  UserValidation.updateUserProfile,
  AuthController.updateUserProfile
);

authRouter.put(
  '/profile/admin',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.updateAdminProfile,
  AuthController.updateAdminProfile
);


export default authRouter;
