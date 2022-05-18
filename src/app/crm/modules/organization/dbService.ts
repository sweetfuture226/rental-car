import { IOrganization, IOrganizationCreate, IOrganizationUpdate } from "./types";
//@ts-ignore
import { Organization, AdminOrganization, Role } from '../../../../db/models';

class OrganizationService  {

  static async createOrganization (payload: IOrganizationCreate): Promise<IOrganization> {
    // create Organization 
     const createdOrganization = await Organization.create(payload);
     if(createdOrganization) {
       // add admin to organization
        await OrganizationService.addAdminToOrganization(createdOrganization.id, payload.ownerId);
      }
    return createdOrganization;  
  }

  static async updateOrganization (id: string, payload: IOrganizationUpdate) {
    return Organization.update(payload, { where: { id } }, { returning: true });
  }

  static async deleteOrganization (id: string) {
    return Organization.destroy({ where: { id } });
  }

  static async getOrganization (where: any,  adminId: string | null = null) {
    let filterObj = {};
    if(adminId) {
      filterObj = {
        include: {
          model: AdminOrganization,
          where: {
            adminId,
          },
        }
      }
    }
    return Organization.findOne({ 
      where,
      ...filterObj
    });
  }

  static async getOrganizations (where: any = {}, adminId: string | null = null) {
    let filterObj = {};
    if(adminId) {
      filterObj = {
        include: {
          model: AdminOrganization,
          where: {
            adminId,
          },
        }
      }
    }
    return Organization.findAll(
      {
        where,
        ...filterObj
      }
    );
  }

  static async addAdminToOrganization (organizationId: string, adminId: string, roleId: string = null) { 
    // check if organization is valid
    const thisOrg = await Organization.findOne({
      where: {
        id: organizationId
      }
    });
    if(!thisOrg) {
      throw new Error('Invalid organization id');
    }
    // check if admin is already link to org
    const thisAdminOrg = await OrganizationService.getAdminOrganization(organizationId, adminId);
    if(thisAdminOrg) {
      throw new Error('Admin organization already exist');
    };
    if(!roleId) {
      const defaultRole = await Role.findOne({ where: { name: 'default' } });
      roleId = defaultRole?.id;
    }
    
    return AdminOrganization.create({
      organizationId,
      adminId,
      roleId
    })
  }


  static async getAdminOrganization (organizationId: string, adminId: string) {
    // check if admin and org are valid record
    const adminOrg = await AdminOrganization.findOne({ 
      where : {
        organizationId,
        adminId,
      }
    });
    return adminOrg;
  }
 
  static async getAdminOrgIDs (adminId: string) {
    const adminOrgs = await AdminOrganization.findAll({
      where: {
        adminId
      }
    });
    return adminOrgs?.map?.(org => org.organizationId);
  }

};

export default OrganizationService;