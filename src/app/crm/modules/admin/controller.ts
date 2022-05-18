import { getSignedDocUrl } from './../../../../utils/importExport';
import { AdminDBService } from './index';
import { OtpServices } from './../otp/index';
import { Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import JWT from '../../../../utils/jwt';
import logger from '../../../../utils/logger';
import ApiResponse from '../../../../utils/response';
import AdminService from './dbService';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import querystring from 'query-string';
import { importFiles, uploadRequest } from '../../../../utils/importExport';
import sendToSQS from '../../../../services/document/sendToSQS';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

class AdminController {
  static async createAdmin(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisAdmin = await AdminService.getAdmin({ email: req.body.email });

      if (thisAdmin) {
        // confirm if this admin has already been created
        return ApiResponse.success(res, 400, 'Admin already exists', null);
      }
      const created = await AdminService.createAdmin(req.body);

      return ApiResponse.success(
        res,
        200,
        'Admin created successfully',
        created,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async loginAdmin(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisAdmin = await AdminService.getAdmin(
        { email: req.body.email },
        true,
      );

      if (!thisAdmin) {
        // confirm if this admin has already been created
        return ApiResponse.success(res, 400, 'Admin does not exists', null);
      }

      const isPasswordValid = await AdminService.comparePassword(
        req.body.password,
        thisAdmin.password,
      );
      if (!isPasswordValid) {
        return ApiResponse.success(res, 400, 'Invalid password', null);
      }

      // generate JWT token
      const token = await JWT.sign(thisAdmin.dataValues);
      const { password, ...admin } = thisAdmin.dataValues;
      return ApiResponse.success(res, 200, 'Admin logged in successfully', {
        admin,
        token: token,
      });
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async registerAdmin(req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisAdmin = await AdminService.getAdmin({ email: req.body.email });

      if (thisAdmin) {
        // confirm if this admin has already been created
        return ApiResponse.success(res, 400, 'Admin already exists', null);
      }
      const created = await AdminService.createAdmin(req.body, 'default');

      const randomOTP = await OtpServices.createOtpForAdminStripe({
        entityId: created.id,
      });

      const generatedToken = await JWT.sign({
        otp: randomOTP,
        adminId: created.id,
      });

      const state = uuidv4();
      // stripe redirect setup
      let stripeConnectParams = {
        response_type: 'code',
        scope: 'read_write',
        state,
        client_id: process.env.STRIPE_CLIENT_ID,
        redirect_uri: `${process.env.STRIPE_REDIRECT_URI}?token=${generatedToken}`,
      };
      //Todo: to do change stringify connect params into url in more elegant way
      const suggestedCapabilities =
        'suggested_capabilities[]=transfers&suggested_capabilities[]=card_payments';
      const stripeUser = `stripe_user[email]=${
        created.email
      }&=stripe_user[country]=${'US'}&stripe_user[first_name]=${
        created.firstName
      }&stripe_user[last_name]=${created.lastName}`;
      let reqQuery = querystring.stringify(stripeConnectParams);
      const url = `https://connect.stripe.com/express/oauth/authorize?${reqQuery}&${suggestedCapabilities}&${stripeUser}`;

      // reditrect to stripe

      // res.redirect(url);
      return ApiResponse.success(res, 200, 'success', {
        redirectUrl: stripeConnectParams.redirect_uri,
      });
    } catch (error) {
      logger('Admin Controller', error);
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateAdmin(req: IRequest, res: Response) {
    try {
      const record = req.body;
      // check if user already exist on db
      const thisAdmin = await AdminService.getAdmin({ id: req.params.adminId });
      // confirm if this user exist
      if (!thisAdmin) {
        return ApiResponse.error(res, 400, 'Admin does not exist');
      }
      await AdminService.updateAdmin(thisAdmin.id, record);
      const admin = await AdminService.getAdmin({ id: thisAdmin.id });
      return ApiResponse.success(res, 200, 'Admin updated successfully', admin);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteAdmin(req: IRequest, res: Response) {
    try {
      return ApiResponse.success(res, 200, 'Admin deleted successfully', null);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAdmins(req: IRequest, res: Response) {
    try {
      const admins = await AdminService.getAdmins(req.query);
      return ApiResponse.success(res, 200, 'Admins retrieved successfully', admins);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAdminById(req: IRequest, res: Response) {
    try {
      const admin = await AdminService.getAdmin({ id: req.params.adminId });
      return ApiResponse.success(
        res,
        200,
        'Admin retrieved successfully',
        admin,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createRole(req: IRequest, res: Response) {
    try {
      // check if role already exist for application
      const thisRole = await AdminService.checkIfRoleExists(
        req.body.name,
        req.body.applicationId,
      );
      if (thisRole) {
        return ApiResponse.success(res, 400, 'Role already exists', null);
      }
      // validate admin and app
      const adminHasApp = await AdminService.checkIfAdminBelongsToApp({
        adminId: req.decoded.id,
        applicationId: req.body.applicationId,
      });
      if (!adminHasApp)
        return ApiResponse.error(
          res,
          400,
          'Admin does not belong to this application',
        );
      req.body.createdBy = req.decoded.id;
      req.body.updatedBy = req.decoded.id;
      const created = await AdminService.createRole(req.body);
      return ApiResponse.success(
        res,
        200,
        'Role created successfully',
        created,
      );
    } catch (error) {
      logger('create Role', error);
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createRoleInternal(req: IRequest, res: Response) {
    try {
      // check if role already exist for application
      const thisRole = await AdminService.checkIfRoleExists(
        req.body.name,
        null,
      );
      if (thisRole) {
        return ApiResponse.success(res, 400, 'Role already exists', null);
      }
      const created = await AdminService.createRole(req.body);
      return ApiResponse.success(
        res,
        200,
        'Role created successfully',
        created,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createPermission(req: IRequest, res: Response) {
    try {
      // check if permission alread exist for application
      const thisPermission = await AdminService.checkPermissionExists(
        req.body.name,
      );
      if (thisPermission) {
        return ApiResponse.success(res, 400, 'Permission already exists', null);
      }
      req.body.createdBy = req.decoded.id;
      req.body.updatedBy = req.decoded.id;
      const created = await AdminService.createPermission(req.body);
      return ApiResponse.success(
        res,
        200,
        'Permission created successfully',
        created,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async attachPermissionsToRole(req: IRequest, res: Response) {
    try {
      // check if permission alread exist for application
      const thisRole = await AdminService.getRole({ id: req.body.roleId });
      if (!thisRole) {
        return ApiResponse.error(res, 400, 'Role does not exist');
      }
      await AdminService.validatePermissionIds(
        req.body.permissionIds,
        req.body.roleId,
      );

      const rec = await AdminService.attachPermissionsToRole({
        roleId: req.body.roleId,
        permissionIds: req.body.permissionIds,
      });
      return ApiResponse.success(
        res,
        200,
        'Permissions attached successfully',
        rec,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAllPermissions(req: IRequest, res: Response) {
    try {
      const permissions = await AdminService.getAllPermissions({});
      return ApiResponse.success(
        res,
        200,
        'Permissions retrieved successfully',
        permissions,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAllRoles(req: IRequest, res: Response) {
    try {
      const roles = await AdminService.getAllRoles({});
      return ApiResponse.success(
        res,
        200,
        'Roles retrieved successfully',
        roles,
      );
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async importLeadsRequest(req: IRequest, res: Response) {
    try {
      // get campaign users
      const admin = req.decoded;

      // create that table
      // file-id on the database
      // get file extension
      const fileExtension = req?.body?.fileName?.split('.')?.pop?.();
      const tagId = req.body.tagId;
      const fileLength = req.body.fileLength;

      if (!fileExtension) {
        return ApiResponse.error(
          res,
          400,
          'Invalid file extension. Provide a valid file for Uploading',
        );
      }
      const fileName = `leads_${admin.id}_${Date.now()}.${
        fileExtension || 'xlsx'
      }`;

      await uploadRequest(res, { fileName, tagId, fileLength }, admin);

      // const leads = await UserService.getAllLeads(req.query);
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async importLeads(req: IRequest, res: Response) {
    // create the document model in the db
    // upload file
    // update the the document model in the db with the file url
    // push an item to the queue

    try {
      // get campaign users
      const admin = req.decoded;

      await importFiles(req, res);

      // const leads = await UserService.getAllLeads(req.query);
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async exportLeads(req: IRequest, res: Response) {
    try {
      // get campaign users
      const admin = req.decoded;

      const fileName = `leads_export_${admin.id}_${Date.now()}.csv`;
      const payload = {
        fileName,
        meta: {
          exportInfo: {
            filters: req.body.filters,
            attributes: req.body.attributes,
            skipRecords: req.body.skipRecords,
            maxRecords: req.body.maxRecords,
          },
        },
      };
      const exportRec = await AdminDBService.createExportRecord(
        admin.id,
        payload,
      );

      await sendToSQS(
        {
          documentId: exportRec.id,
          ...payload?.meta?.exportInfo,
        },
        'export_queue',
      );
      // send to export Queue
      return ApiResponse.success(
        res,
        200,
        'Export request created successfully',
        exportRec,
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getDocumentUrl(req: IRequest, res: Response) {
    try {
      const document = await AdminDBService.getDocumentWithId(
        req.params.documentId,
      );
      if (!document) {
        return ApiResponse.error(res, 400, 'Document does not exist');
      }
      if (!document.key) {
        if (['EXPORT_REQUEST_INITIATED', 'EI'].includes(document.status)) {
          return ApiResponse.error(res, 400, 'Document is being exported');
        }
        if (['EXPORT_REQUEST_FAILED', 'EF'].includes(document.status)) {
          return ApiResponse.error(res, 400, 'Document export failed');
        }
        return ApiResponse.error(res, 400, 'Document still processing');
      }
      const docUrl = await getSignedDocUrl(document.key);
      return ApiResponse.success(res, 200, 'Document retrieved successfully', {
        docUrl,
      });
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getAdminDocuments(req: IRequest, res: Response) {
    try {
      const documents = await AdminDBService.getDocuments({
        adminId: req.decoded.id,
      });
      return ApiResponse.success(
        res,
        200,
        'Documents retrieved successfully',
        documents,
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getFormElements(req: IRequest, res: Response) {
    try {
      const formElements = await AdminDBService.getFormElements({
        ...(req.query.type ? { type: req.query.type } : {}),
      });
      return ApiResponse.success(
        res,
        200,
        'Form elements retrieved successfully',
        formElements,
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async createFormElement(req: IRequest, res: Response) {
    try {
      const thisForm = await AdminDBService.getFormElement({
        name: req.body.name,
      });
      if (thisForm) {
        return ApiResponse.error(
          res,
          400,
          `Form element with name ${req.body.name} already exists`,
        );
      }
      const formElement = await AdminDBService.createFormElement({
        ...req.body,
        type: 'optionalValues',
        status: 'active',
        createdBy: req.decoded.id,
        updatedBy: req.decoded.id,
      });
      return ApiResponse.success(
        res,
        200,
        'Form element created successfully',
        formElement,
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async updateFormElement(req: IRequest, res: Response) {
    try {
      const thisForm = await AdminDBService.getFormElement({
        id: req.params.formId,
      });
      if (!thisForm) {
        return ApiResponse.error(res, 400, `Form element does not exist`);
      }
      if (thisForm?.name === req?.body?.name) {
        return ApiResponse.error(
          res,
          400,
          `Form element with name ${req.body.name} already exists`,
        );
      }

      const formElement = await thisForm.update({
        ...req.body,
        meta: {
          ...(thisForm.meta || {}),
          ...(req.body.meta || {}),
        },
        updatedBy: req.decoded.id,
      });

      return ApiResponse.success(
        res,
        200,
        'Form element updated successfully',
        formElement,
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async deleteFormElement(req: IRequest, res: Response) {
    try {
      const thisForm = await AdminDBService.getFormElement({
        id: req.params.formId,
      });
      if (!thisForm) {
        return ApiResponse.error(res, 400, `Form element does not exist`);
      }
      await AdminDBService.deleteFormElement(req.params.formId);
      return ApiResponse.success(
        res,
        200,
        'Form element deleted successfully',
        {},
      );
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async getTags(req: IRequest, res: Response) {
    try {
      const Tags = await AdminDBService.getTags({});
      return ApiResponse.success(res, 200, 'Tags retrieved successfully', Tags);
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async createTag(req: IRequest, res: Response) {
    let Tag;

    try {
      Tag = await AdminDBService.getTag({
        name: req.body.name.toLowerCase(),
      });

      if (!Tag)
        Tag = await AdminDBService.createTag({
          ...req.body,
          name: req.body.name.toLowerCase(),
          createdBy: req.decoded.id,
          updatedBy: req.decoded.id,
        });

      return ApiResponse.success(res, 200, 'Tag created successfully', Tag);
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  static async updateTag(req: IRequest, res: Response) {
    try {
      const thisTag = await AdminDBService.getTag({
        id: req.params.tagId,
      });
      if (!thisTag) {
        return ApiResponse.error(res, 400, `Form element does not exist`);
      }
      if (thisTag?.name === req?.body?.name) {
        return ApiResponse.error(
          res,
          400,
          `Form element with name ${req.body.name} already exists`,
        );
      }

      const tag = await thisTag.update({
        ...req.body,
        meta: {
          ...(thisTag.meta || {}),
          ...(req.body.meta || {}),
        },
        updatedBy: req.decoded.id,
      });

      return ApiResponse.success(res, 200, 'tag updated successfully', tag);
    } catch (error) {
      return ApiResponse.error(res, 500, error.message);
    }
  }
}

export default AdminController;
