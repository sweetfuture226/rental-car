import { generateRandomAccessKeyString } from '../../../../utils/helpers';
import { IApplication } from "./types";
//@ts-ignore
import { Application, AccessKey, AdminApplication, Admin, Role } from '../../../../db/models';

class ApplicationService  {
  static async getApplicationAccessKey (where: any) {
    return AccessKey.findOne({ where });
  }

  static async createApplication ({ name, description, slug}: { name: string; description: string; slug: string}): Promise<{ app: IApplication; credentials: any}> {
    // create Application 
     const createdApplication = await Application.create({
      name,
      description,
      slug
     });
     // Generate Access Keys
     let accesKeyExist = await ApplicationService.getApplicationAccessKey( { entityId: createdApplication.id, entityType: 'application' });
     if(!accesKeyExist) {
      accesKeyExist = await AccessKey.create({
        entityId: createdApplication.id,
        entityType: 'application',
        key: generateRandomAccessKeyString(),
        isActive: true,
       });
     }
    return { app: createdApplication, credentials: accesKeyExist };  
  }

  static async updateApplication (id: string, payload: IApplication) {
    return Application.update(payload, { where: { id } }, { returning: true });
  }

  static async deleteApplication (id: string) {
    return Application.destroy({ where: { id } });
  }

  static async getApplication (where: any,  adminId: string | null = null) {
    let filterObj = {};
    if(adminId) {
      filterObj = {
        include: {
          model: AdminApplication,
          as: 'adminApps',
          where: {
            adminId,
          },
          attributes: [],
        }
      }
    }
    return Application.findOne({ 
      where,
      ...filterObj
    });
  }

  static async getApplications (where: any = {}, adminId: string | null = null) {
    let filterObj = {};
    if(adminId) {
      filterObj = {
        include: {
          model: AdminApplication,
          as: 'adminApps',
          where: {
            adminId,
          },
          attributes: [],
        }
      }
    }
    return Application.findAll(
      {
        where,
        ...filterObj
      }
    );
  }

  static async addAdminToApplication (applicationId: string, adminId: string) { 
    // check if application is valid
    const thisApp = await Application.findOne({
      where: {
        id: applicationId
      }
    });
    if(!thisApp) {
      throw new Error('Invalid application id');
    }
    // check if admin is already link to app
    const thisAdminApp = await ApplicationService.getAdminApplication(applicationId, adminId);
    if(thisAdminApp) {
      throw new Error('Admin application already exist');
    }
    return AdminApplication.create({
      applicationId,
      adminId,
    })
  }

  static async getApplicationCredentialsById (id: string) {
    return AccessKey.findOne({ 
      where: { entityId: id, entityType: 'application' }
    });
  }

  static async getAdminApplication (applicationId: string, adminId: string) {
    // check if admin and app are valid record

    // check if admin exists
    const admin = await Admin.findOne({ where: { id: adminId }, include: {
      model: Role,
      as: 'role',
    } });
    if(!admin) {
      throw new Error('Admin does not exist');
    }
    // check if application exists
    const application = await Application.findOne({ where: { id: applicationId } });
    if(!application) {
      throw new Error('Application does not exist');
    }

    return AdminApplication.findOne({ 
      where : {
        applicationId,
        adminId,
      }
    });
  }
};

export default ApplicationService;