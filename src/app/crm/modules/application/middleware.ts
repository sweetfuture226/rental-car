import ApiResponse from "../../../../utils/response";
import { Response, Request, NextFunction } from "express";
import ApplicationService from "./dbService";
import { IRequest } from "../../../../utils/joiSetup";

class ApplicationMiddleware {
  static async validateAppAccessKey (req: Request, res: Response, next: NextFunction) {
  const { accesskey } = req.headers;
  if (!accesskey) {
    return ApiResponse.error(res, 400, 'Access key is required');
  }
  const accesKeyExist = await ApplicationService.getApplicationAccessKey( { key: accesskey, isActive: true });
  if (!accesKeyExist) {
    return ApiResponse.error(res, 400, 'Invalid access key');
  }
  req.body.applicationId = accesKeyExist.entityId;
  next();
}


  static getApplicationDetails (appSlug): (req: IRequest, res: Response, next: NextFunction) => any {
    return async (req: IRequest, res: Response, next: NextFunction) => {
      const application = await ApplicationService.getApplication( { slug: appSlug });
      if (!application) {
        return ApiResponse.error(res, 400, 'Invalid application');
      }
      // req.body.applicationId = application.id;
      req.application = application;
      next();
    }
  }

  static AttachAppIdToReqBody (req: IRequest, res: Response, next: NextFunction) {
    if(req.application) {
      req.body.applicationId = req.application.id;
    }
    next();
  }
}


export default ApplicationMiddleware;