import { AdminMiddleware } from './../../modules/admin/index';
import express from 'express';
import { UIContentController, UIContentValidation } from '../../modules/content';
import { AuthMiddleware } from '../../modules/auth';

const uiContentRouter = express.Router();

uiContentRouter.get(
  '/',
  UIContentController.getUIContents
);

uiContentRouter.get(
  '/:contentId',
  UIContentValidation.getUIContentById,
  UIContentController.getUIContentById
);

uiContentRouter.patch(
  '/:contentId',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_update_ui_content'),
  UIContentValidation.updateUIContent,
  UIContentController.updateUIContent
);

uiContentRouter.delete(
  '/:contentId',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_delete_ui_content'),
  UIContentValidation.deleteUIContent,
  UIContentController.deleteUIContent
);

uiContentRouter.post(
  '/',
  AuthMiddleware.AdminTokenAuth,
  AuthMiddleware.CheckPermission('can_create_ui_content'),
  UIContentValidation.createUIContent,
  UIContentController.createUIContent
);


export default uiContentRouter;
