import { validateDocId } from './../../modules/admin/validations';
import { AuthMiddleware } from './../../modules/auth/index';
import { AdminMiddleware } from '../../modules/admin/index';
import express from 'express';
import { AdminController, AdminValidation } from '../../modules/admin';

const adminRouter = express.Router();

adminRouter.get(
  '/',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_admins'),
  AdminController.getAdmins,
);

adminRouter.get(
  '/permission',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_permissions'),
  AdminController.getAllPermissions,
);

adminRouter.get(
  '/roles',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_roles'),
  AdminController.getAllRoles,
);


adminRouter.post(
  '/',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_create_admin'),
  AdminValidation.createAdmin,
  AdminController.createAdmin,
);

adminRouter.post(
  '/login',
  AdminValidation.loginAdmin,
  AdminController.loginAdmin,
);

adminRouter.post(
  '/register',
  AdminValidation.createAdmin,
  AdminController.registerAdmin,
);

adminRouter.patch(
  '/:adminId',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_update_admin'),
  AdminValidation.updateAdmin,
  AdminController.updateAdmin,
);

adminRouter.post(
  '/role',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_create_application_role'),
  AdminValidation.createRole,
  AdminController.createRole,
);

adminRouter.post(
  '/role/internal',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_create_application_role'),
  AdminValidation.createRoleInternal,
  AdminController.createRoleInternal,
);

adminRouter.post(
  '/permission',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_create_permission'),
  AdminValidation.createPermission,
  AdminController.createPermission,
);

adminRouter.patch(
  '/role/attach-permission',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_attach_permissions_to_role'),
  AdminValidation.attachPermissionToRole,
  AdminController.attachPermissionsToRole,
);

adminRouter.post(
  '/import-leads',
  AuthMiddleware.AdminTokenAuth,
  AdminController.importLeads,
);

adminRouter.post(
  '/export-leads',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.exportRequest,
  AdminController.exportLeads,
);

adminRouter.get(
  '/document-url/:documentId',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.validateDocId,
  AdminController.getDocumentUrl,
);

adminRouter.post(
  '/leads-upload-request',
  AuthMiddleware.AdminTokenAuth,
  AdminController.importLeadsRequest,
);

adminRouter.get(
  '/get-documents',
  AuthMiddleware.AdminTokenAuth,
  AdminController.getAdminDocuments,
);

adminRouter.get(
  '/form-element',
  AdminController.getFormElements,
);


adminRouter.post(
  '/form-element',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.createFormElement,
  AdminController.createFormElement,
)

adminRouter.put(
  '/form-element/:formId',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.updateFormElement,
  AdminController.updateFormElement,
)

adminRouter.delete(
  '/form-element/:formId',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.validateFormId,
  AdminController.deleteFormElement,
);

adminRouter.get(
  '/tag',
  AdminController.getTags,
);


adminRouter.post(
  '/tag',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.createTag,
  AdminController.createTag,
)

adminRouter.put(
  '/tag/:tagId',
  AuthMiddleware.AdminTokenAuth,
  AdminValidation.updateTag,
  AdminController.updateTag,
)

adminRouter.get(
  '/:adminId',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_get_admins'),
  AdminValidation.getAdminById,
  AdminController.getAdminById,
);

export default adminRouter;
