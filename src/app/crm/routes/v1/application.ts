import { AdminMiddleware } from '../../modules/admin/index';
import express from 'express';
import { ApplicationController, ApplicationValidation} from '../../modules/application';
import { AuthMiddleware } from '../../modules/auth';

const applicationRouter = express.Router();

applicationRouter.get(
  '/',
  // AdminMiddleware.AdminOrAccessKey,
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_applications'),
  ApplicationController.getApplications
);

applicationRouter.get(
  '/:applicationId',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_applications'),
  ApplicationValidation.getApplicationById,
  ApplicationController.getApplicationById
);

applicationRouter.post(
  '/',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_create_application'),
  ApplicationValidation.createApplication,
  ApplicationController.createApplication
);

applicationRouter.patch(
  '/:applicationId',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_update_application'),
  ApplicationValidation.updateApplication,
  ApplicationController.updateApplication
);

applicationRouter.patch(
  '/:applicationId/addAdmin',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_add_admin_to_application'),
  ApplicationValidation.addAdminToApplication,
  ApplicationController.addAdminToApplication
);

applicationRouter.get(
  '/accessKey/:applicationId',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_application_credentials'),
  ApplicationValidation.getApplicationById,
  ApplicationController.getApplicationAndCredentialsById
);

export default applicationRouter;
