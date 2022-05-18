import { Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import { AdminDBService } from '../admin';
import AdminService from '../admin/dbService';
import OrganizationService from './dbService';


class Organization {
  static async createOrganization (req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      let thisOrganization = await OrganizationService.getOrganization({name: req.body.name});

      if(thisOrganization) {
        // confirm if this organization has already been created
        return ApiResponse.success(res, 400, 'Organization already exists', null);
      }
      const created = await OrganizationService.createOrganization({...req.body, ownerId: req.decoded.id});

      return ApiResponse.success(res, 200,  'Organization created successfully', created);
    } catch (error) {
       return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateOrganization (req: IRequest, res: Response) {
    try {
      const record = req.body;
      // check if user already exist on db
      const thisOrganization = await OrganizationService.getOrganization({id: req.params.organizationId});
     // confirm if this user exist
      if(!thisOrganization) {
        return ApiResponse.error(res, 400, 'Organization does not exist');
      }
       await OrganizationService.updateOrganization(thisOrganization.id, record);
       const organization = await OrganizationService.getOrganization({id: thisOrganization.id});
      return ApiResponse.success(res, 200, 'Organization updated successfully', organization);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteOrganization (req: IRequest, res: Response) {
    try {
      const thisOrganization = await OrganizationService.getOrganization({id: req.params.organizationId});
     // confirm if this user exist
      if(!thisOrganization) {
        return ApiResponse.error(res, 400, 'Organization does not exist');
      }
      await OrganizationService.deleteOrganization(thisOrganization.id);
      return ApiResponse.success(res, 200, 'Organization deleted successfully', null);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getOrganizations (req: IRequest, res: Response) {
    try {
      // fetch all organizations by an ordinary admin
      const adminId = req.decoded ? req.decoded.id : null;
      const orgs = await OrganizationService.getOrganizations({}, adminId);
      return ApiResponse.success(res, 200, 'Organizations retrieved successfully', orgs);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getOrganizationById (req: IRequest, res: Response) {
    try {
      const adminId = req.decoded ? req.decoded.id : null;
      const organization = await OrganizationService.getOrganization({id: req.params.organizationId}, adminId);
      return ApiResponse.success(res, 200, 'Organization retrieved successfully', organization);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async addAdminToOrganization (req: IRequest, res: Response) {
    try {
      // check if admin exists
      const thisAdmin = await AdminDBService.getAdmin({
        id: req.body.adminId
      });
      if(!thisAdmin) {
        return ApiResponse.error(res, 400, 'Invalid Admin ID');
      }
      const record = await OrganizationService.addAdminToOrganization(req.params.organizationId, req.body.adminId, req.body.roleId);
      return ApiResponse.success(res, 200, 'Admin added to organization successfully', record);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }
}

export default Organization;