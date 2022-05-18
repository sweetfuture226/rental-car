import { AdminMiddleware } from '../../modules/admin/index';
import express from 'express';
import { OrganizationController, OrganizationValidation } from '../../modules/organization';
import { AuthMiddleware } from '../../modules/auth';

const organizationRouter = express.Router();

organizationRouter.get(
  '/',
  // AdminMiddleware.AdminOrAccessKey,
  AuthMiddleware.AdminTokenAuth,
  OrganizationController.getOrganizations
);

organizationRouter.get(
  '/:organizationId',
  AuthMiddleware.AdminTokenAuth,
  OrganizationValidation.getOrganizationById,
  OrganizationController.getOrganizationById
);

organizationRouter.post(
  '/',
  AuthMiddleware.AdminTokenAuth,
  OrganizationValidation.createOrganization,
  OrganizationController.createOrganization
);

organizationRouter.patch(
  '/:organizationId',
  AuthMiddleware.AdminTokenAuth,
  OrganizationValidation.updateOrganization,
  OrganizationController.updateOrganization
);

organizationRouter.patch(
  '/:organizationId/addAdmin',
  AuthMiddleware.AdminTokenAuth,
  OrganizationValidation.addAdminToOrganization,
  OrganizationController.addAdminToOrganization
);

export default organizationRouter;
