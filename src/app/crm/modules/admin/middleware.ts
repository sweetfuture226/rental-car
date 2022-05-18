import { ApplicationMiddleware } from '../application/index';
import ApiResponse from "../../../../utils/response";
import { Response, Request, NextFunction } from "express";
import JWT from "../../../../utils/jwt";
import { IRequest } from "../../../../utils/joiSetup";
// @ts-ignore
import { AdminApplication, AccessKey } from '../../../../db/models';
import ApplicationService from '../application/dbService';
import logger from '../../../../utils/logger';

class AdminMiddleware {
  static async AdminRouteOnly (req: IRequest, res: Response, next: NextFunction) {
  try {
    const { token } = req.headers;
    if (!token) {
      return ApiResponse.error(res, 403, "Unauthorized for Admin only");
    }
    const decoded = await JWT.verify(token);
    req.admin = decoded;
    next();
  } catch (error) {
    return ApiResponse.error(res, 403, "Unauthorized for Admin only");
  }
}

  static async SuperAdminRouteOnly (req: IRequest, res: Response, next: NextFunction) {
    try {
      const { token } = req.headers;
      if (!token) {
        return ApiResponse.error(res, 403, "Unauthorized. Super Admin only");
      }
      const decoded = await JWT.verify(token);
      if(decoded.role.name !== 'superadmin') {
        return ApiResponse.error(res, 403, "Unauthorized. Super Admin only");
      }
      req.admin = decoded;
    next();
    } catch (error) {
      return ApiResponse.error(res, 403, "Unauthorized. Super Admin only");
    }
  }

  static async AdminOrAccessKey (req: IRequest, res: Response, next: NextFunction) {
    try {
      const { token, accesskey } = req.headers;
      if(!token && !accesskey) {
        return ApiResponse.error(res, 403, "Unauthorized. Admin or Access Key required");
      }
      if(accesskey) {
        return ApplicationMiddleware.validateAppAccessKey(req, res, next);
      } else {
        return AdminMiddleware.AdminRouteOnly(req, res, next);
      }
    } catch (error) {
      logger('AdminOrAccessKey', error.message)
       return ApiResponse.error(res, 403, "Unauthorized. Admin or Access Key required");
    }
  }
}


export default AdminMiddleware;