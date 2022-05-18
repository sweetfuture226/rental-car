import ApiResponse from "../../../../utils/response";
import { Response, Request, NextFunction } from "express";
import OrganizationService from "./dbService";
import { IRequest } from "../../../../utils/joiSetup";

class OrganizationnMiddleware {
  static async ValidateAdminOrganization(req: IRequest, res: Response, next: NextFunction) {
    try {
        const { organizationId } = req.body;
        const adminId = req.decoded.id;
        const adminOrg = await OrganizationService.getAdminOrganization(organizationId, adminId);
        if (!adminOrg) {
          return ApiResponse.error(res, 400, "Invalid organization for this admin");
        }
        next();
    } catch (error) {
      console.log(error.message);
      return ApiResponse.error(res, 400, 'Operation failed');
    }
   
  }
}


export default OrganizationnMiddleware;