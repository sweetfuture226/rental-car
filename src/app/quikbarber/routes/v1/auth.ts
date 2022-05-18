
import express from 'express';
import { ApplicationMiddleware } from '../../../crm/modules/application';
import {AuthValidation, AuthController} from '../../../crm/modules/auth';
import { UserController, UserValidation } from '../../../crm/modules/users';

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

authRouter.post('/admin/register', ApplicationMiddleware.AttachAppIdToReqBody, AuthValidation.registerAdminOTP, AuthController.AdminRegisterOTP);



export default authRouter;
