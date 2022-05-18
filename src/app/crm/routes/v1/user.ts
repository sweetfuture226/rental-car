import { AdminMiddleware } from '../../modules/admin/index';
import express from 'express';
import { UserController, UserValidation } from '../../modules/users';
import { ApplicationMiddleware } from '../../modules/application';
import { AuthMiddleware } from '../../modules/auth';

const userRouter = express.Router();

userRouter.get('/', AdminMiddleware.AdminOrAccessKey, UserController.getUsers);

userRouter.get(
  '/otp/:phone',
  ApplicationMiddleware.validateAppAccessKey,
  UserValidation.validatePhone,
  UserController.getOTpforUserLogin,
);

userRouter.post(
  '/login',
  ApplicationMiddleware.validateAppAccessKey,
  UserValidation.userLogin,
  UserController.loginUser,
);

userRouter.post(
  '/',
  ApplicationMiddleware.validateAppAccessKey,
  UserValidation.createUser,
  UserController.createUser,
);

userRouter.post(
  '/admin',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_create_leads'),
  UserValidation.createUserByAdmin,
  UserController.createUserByAdmin,
);

userRouter.post(
  '/create/campaign',
  AuthMiddleware.AdminTokenAuth,
  // AuthMiddleware.CheckPermission('can_create_campaign'),
  UserValidation.createCampaign,
  UserController.createCampaign,
);

userRouter.post(
  '/campaign',
  UserValidation.createUserCampaign,
  UserController.createUserCampaign,
);

userRouter.get(
  '/campaign/:campaignId',
  UserValidation.getCampaignById,
  UserController.getCampaignById,
);

userRouter.get(
  '/campaign/:campaignId/reports',
  UserValidation.getCampaignById,
  UserController.getCampaignReports,
);

userRouter.put(
  '/campaign/:campaignId',
  AuthMiddleware.AdminTokenAuth,
  UserValidation.updateCampaign,
  UserController.updateCampaign,
);

userRouter.get(
  '/campaigns',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.AttachFlagForPermission('can_get_all_campaigns'),
  UserController.getCampaigns,
);

userRouter.get('/all-campaigns', UserController.getAllCampaigns);

userRouter.post(
  '/payment-intent',
  UserValidation.paymentIntent,
  UserController.paymentIntent,
);

userRouter.post(
  '/payment',
  UserValidation.createChargeCredit,
  UserController.createChargeCredit,
);

userRouter.get(
  '/leads',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_all_leads'),
  UserController.getAllLeads,
);

userRouter.get(
  '/leads/get-own-leads',
  AuthMiddleware.AdminTokenAuth,
  UserValidation.validateGetOwnLeads,
  UserController.getAvailableUsersForAnAdmin,
);

userRouter.get(
  '/leads-data-points',
  AuthMiddleware.AdminTokenAuth,
  UserController.getSearchDataPoints,
);

userRouter.get(
  '/leads-search-all',
  AuthMiddleware.AdminTokenAuth,
  UserController.searchAllLeads,
);

userRouter.get(
  '/get-property-values',
  AuthMiddleware.AdminTokenAuth,
  UserController.getPropertyValues,
);

userRouter.get(
  '/leads/:campaignId',
  AuthMiddleware.AdminTokenAuth,
  UserController.getCampaignLeads,
);

userRouter.put(
  '/:id',
  ApplicationMiddleware.validateAppAccessKey,
  UserValidation.updateUser,
  UserController.updateUser,
);

userRouter.get(
  '/:id',
  AdminMiddleware.AdminOrAccessKey,
  UserValidation.getUserById,
  UserController.getUserById,
);



export default userRouter;
