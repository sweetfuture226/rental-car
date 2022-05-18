
import express from 'express';
import {ApplicationMiddleware} from '../../../crm/modules/application';
import {AuthValidation as CRMAuthValidation, AuthController as CRMAuthController, AuthMiddleware as CRMAuthMiddleware} from '../../../crm/modules/auth';
import { UserController, UserValidation } from '../../../crm/modules/users';
import { AuthController } from '../../modules/auth';

const authRouter = express.Router();

authRouter.post('/register', ApplicationMiddleware.AttachAppIdToReqBody, UserValidation.registerUser, UserController.registerUser);

authRouter.get(
  '/user/otp/:phone',
  ApplicationMiddleware.AttachAppIdToReqBody,
  UserValidation.validatePhone,
  UserController.getOTpforUserLogin
);

authRouter.post(
  '/user/login',
  ApplicationMiddleware.AttachAppIdToReqBody,
  UserValidation.userLogin,
  UserController.loginUser
);

authRouter.post('/admin/register', ApplicationMiddleware.AttachAppIdToReqBody, CRMAuthValidation.registerAdminOTP, CRMAuthController.AdminRegisterOTP);

authRouter.post('/user/address', UserValidation.addAddress, CRMAuthMiddleware.UserTokenAuth,  AuthController.addAddress);
authRouter.put('/user/address/:addressId', UserValidation.updateAddress, CRMAuthMiddleware.UserTokenAuth, AuthController.updateAddress);
authRouter.delete('/user/address/:addressId', UserValidation.validateAddressId, CRMAuthMiddleware.UserTokenAuth, AuthController.deleteAddress);
authRouter.get('/user/address/:addressId', UserValidation.validateAddressId, CRMAuthMiddleware.UserTokenAuth, AuthController.getSingleAddress);
authRouter.get('/user/address', CRMAuthMiddleware.UserTokenAuth, AuthController.getAllAddress);

export default authRouter;
