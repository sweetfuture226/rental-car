import { AdminDBService } from './../admin/index';
import { ApplicationMiddleware } from '../application/index';
import ApiResponse from '../../../../utils/response';
import { Response, Request, NextFunction } from 'express';
import JWT from '../../../../utils/jwt';
import { IRequest } from '../../../../utils/joiSetup';
import AuthService from './dbService';
import { UserDBService } from '../users';
import logger from '../../../../utils/logger';

class AuthMiddleware {
  static async AdminTokenAuth(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.headers;
      const { q_inf } = req.cookies;

      if (!(token || q_inf)) {
        return ApiResponse.error(
          res,
          401,
          'Unauthorized. Provide authentication',
        );
      }
      const decoded = await JWT.verify(token || q_inf);
      if(!decoded?.id) {
        return ApiResponse.error(
          res,
          401,
          'Unauthorized. Provide authentication',
        );
      }
      const decodedRecord = await AdminDBService.getAdmin(
        { id: decoded.id },
        true,
      );
      if(!decodedRecord){
        return ApiResponse.error(res, 401, 'Unauthorized. Authentication failed. Login again');
      }
      req.decoded = decodedRecord;
      next();
    } catch (error) {
      logger(error.message);
      return ApiResponse.error(res, 401, 'Unauthorized. Authentication failed');
    }
  }

  static async AdminAppTokenAuth(
    req: IRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.headers;
      if (!token) {
        return ApiResponse.error(
          res,
          401,
          'Unauthorized. Provide authentication',
        );
      }
      const decoded = await JWT.verify(token);
      const decodedRecord = await AdminDBService.getAdmin(
        { id: decoded.id },
        true,
      );
      console.log(decodedRecord);
      req.decoded = decodedRecord;
      next();
    } catch (error) {
      console.log(error.message);
      return ApiResponse.error(res, 401, 'Unauthorized. Authentication failed');
    }
  }

  static CheckPermission(permissionName: string) {
    return async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const adminPermission = await AuthService.checkAdminPermissions({
          roleId: req.decoded.roleId,
          permission: permissionName,
        });
        if (!adminPermission?.length) {
          return ApiResponse.error(
            res,
            403,
            'You are not allowed to access this route.',
          );
        }
        next();
      } catch (error) {
        return ApiResponse.error(
          res,
          401,
          'Unauthorized. Authentication failed',
        );
      }
    };
  }

  static AttachFlagForPermission(permissionName: string) {
    return async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const adminPermission = await AuthService.checkAdminPermissions({
          roleId: req.decoded.roleId,
          permission: permissionName,
        });
        if (!adminPermission?.length) {
          next();
        } else {
          req.isAllowed = true;
          next();
        }
      } catch (error) {
        return ApiResponse.error(
          res,
          401,
          'Unauthorized. Authentication failed',
        );
      }
    };
  }

  static attachAppOwnerRole(req: IRequest, res: Response, next: NextFunction) {
    req.body.internalRole = 'appowner';
    next();
  }

  static async UserTokenAuth(req: IRequest, res: Response, next: NextFunction) {
    try {
      const { token } = req.headers;
      if (!token) {
        return ApiResponse.error(
          res,
          401,
          'Unauthorized. Provide authentication',
        );
      };
      const decoded = await JWT.verify(token);
      const decodedRecord = await UserDBService.getUserById(decoded.id);
      req.decodedUser = decodedRecord;
      next();
    } catch (error) {
      console.log(error.message, '>>');
      return ApiResponse.error(res, 401, 'Unauthorized. Authentication failed');
    }
  }

  static async addTokenToCookie(res: Response, token) {
    res.cookie('q_inf', token, {
      maxAge: 60 * 60 * 24,
      secure: true,
      sameSite: 'none',
    });
  }

  static async UserTokenAuthIfExist(req: IRequest, res: Response, next: NextFunction) {
    try {
      const { token } = req.headers;
      if (token) {
        const decoded = await JWT.verify(token);
        const decodedRecord = await UserDBService.getUserById(decoded.id);
        req.decodedUser = decodedRecord;
      }
      next();
    } catch (error) {
      console.log(error.message);
      return ApiResponse.error(res, 401, 'Unauthorized. Authentication failed');
    }
  }
}

export default AuthMiddleware;
