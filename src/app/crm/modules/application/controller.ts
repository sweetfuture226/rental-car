import { Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import { AdminDBService } from '../admin';
import AdminService from '../admin/dbService';
import ApplicationService from './dbService';


class Application {
  static async createApplication (req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisApplication = await ApplicationService.getApplication({name: req.body.name});

      if(thisApplication) {
        // confirm if this application has already been created
        return ApiResponse.success(res, 400, 'Application already exists', null);
      }
      const created = await ApplicationService.createApplication(req.body);

      return ApiResponse.success(res, 200,  'Application created successfully', created);
    } catch (error) {
       return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateApplication (req: IRequest, res: Response) {
    try {
      const record = req.body;
      // check if user already exist on db
      const thisApplication = await ApplicationService.getApplication({id: req.params.applicationId});
     // confirm if this user exist
      if(!thisApplication) {
        return ApiResponse.error(res, 400, 'Application does not exist');
      }
       await ApplicationService.updateApplication(thisApplication.id, record);
       const application = await ApplicationService.getApplication({id: thisApplication.id});
      return ApiResponse.success(res, 200, 'Application updated successfully', application);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteApplication (req: IRequest, res: Response) {
    try {
      
      return ApiResponse.success(res, 200, 'Application deleted successfully', null);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getApplications (req: IRequest, res: Response) {
    try {
      // fetch all applications by an ordinary admin
      const adminId = req.decoded && req.decoded.role.name === 'admin' ? req.decoded.id : null;
      const apps = await ApplicationService.getApplications({}, adminId);
      return ApiResponse.success(res, 200, 'Applications retrieved successfully', apps);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getApplicationById (req: IRequest, res: Response) {
    try {
      const adminId = req.decoded && req.decoded.role.name === 'admin' ? req.decoded.id : null;
      const application = await ApplicationService.getApplication({id: req.params.applicationId}, adminId);
      return ApiResponse.success(res, 200, 'Application retrieved successfully', application);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getApplicationAndCredentialsById (req: IRequest, res: Response) {
    try {
      const application = await ApplicationService.getApplicationCredentialsById( req.params.applicationId);
      return ApiResponse.success(res, 200, 'Application Access key retrieved successfully', application);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async addAdminToApplication (req: IRequest, res: Response) {
    try {
      // check if admin exists
      const thisAdmin = await AdminDBService.getAdmin({
        id: req.body.adminId
      });
      if(!thisAdmin) {
        return ApiResponse.error(res, 400, 'Invalid Admin ID');
      }
      const record = await ApplicationService.addAdminToApplication(req.params.applicationId, req.body.adminId);
      return ApiResponse.success(res, 200, 'Admin added to application successfully', record);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }
}

export default Application;