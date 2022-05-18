import { cleanUpDBRes, comparePassword, passwordHasher } from '../../../../utils/helpers';
import { IAdmin, IAdminCreate, IAdminUpdate } from "./types";
import { Op } from 'sequelize';
//@ts-ignore
import { Admin, Role, Application, AdminApplication, Permission, RolePermission, Document, FormElement, Tag } from '../../../../db/models';
import logger from '../../../../utils/logger';

class AdminService  {
  static async getRoleByName (name: string) {
    return Role.findOne({ where: {
      name
    } });
  }

  static async comparePassword (input: string, dbPassword: string) {
    return comparePassword(input, dbPassword);
  }

  static async createAdmin (payload: IAdminCreate, role: string = 'admin'): Promise<IAdmin> {
    // hash password 
    const password = payload.password ? await passwordHasher(payload.password): '##';

    // attach admin role

    const adminRole = await AdminService.getRoleByName(role || 'admin');
    if(!adminRole) throw new Error('Admin cannot be created contact support')
    
    const roleId = adminRole?.id
    // create Admin 
     const createdAdmin = await Admin.create({
      ...payload,
      password,
      roleId
     });
     // Generate Access Keys
    
     const result: Promise<IAdmin> = cleanUpDBRes(createdAdmin)

    return result;  
  }

  static async updateAdminPassword ({rawPassword, adminId}: {rawPassword: string; adminId: string}, shouldCompareWithOld: boolean = true) {
    const password = await passwordHasher(rawPassword);
    return Admin.update({password}, { where: { id: adminId } }, { returning: true });
  }

  static async updateAdmin (id: string, payload: IAdminUpdate) {
    return Admin.update(payload, { where: { id } }, { returning: true });
  }

  static async deleteAdmin (id: string) {
    return Admin.destroy({ where: { id } });
  }

  static async getAdmin (where: any, includePassword: boolean = false) {
    return Admin.findOne({ 
      where,
      attributes: {
        exclude: includePassword ? [] : ['password']
      },
      include: [
      {
        model: Role,
        as: 'role',
        attributes: ['name'],
      },
      {
        model: AdminApplication,
        as: 'adminApps',
        attributes: ['adminId'],
        include: {
          model: Application,
          as: 'applications',
        }
      }
      ]
    });
  }

  static async getAdmins (where: any = {}) {
    return Admin.findAll(
      {
        where,
        attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'roleId',  'createdAt', 'updatedAt'],
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['name'],
          },
          {
            model: AdminApplication,
            as: 'adminApps',
            attributes: ['adminId'],
            include: {
              model: Application,
              as: 'applications',
            }
          }
          ]
      }
    );
  }

  static async getAdminProfile (where: any = {}) {
    return Admin.findOne(
      {
        where,
        attributes: {exclude: ['password', 'stripeAcctId']},
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['name'],
          },
          ]
      }
    );
  }

  static async createRole (rolePayload: { name: string, applicationId: string, createdBy: string, updatedBy: string }) {
    return Role.create(rolePayload);
  }

  static async createPermission (permissionPayload: { name: string, description: string, createdBy: string, updatedBy: string }) {
    return Permission.create(permissionPayload);
  }

  static async createBulkPermissions (permissions: { name: string, description: string }[]) {
    return Role.bulkCreate(permissions);
  }

  static async attachPermissionsToRole ({ roleId, permissionIds}: { roleId: string, permissionIds: string[] }) {
   const generateBulkRecords = permissionIds.map(permissionId => ({
      roleId,
      permissionId,
    }));
    return RolePermission.bulkCreate(generateBulkRecords);
  }

  static async getRolePermissions (roleId: string) {
    return RolePermission.findAll({
      where: { roleId },
      include: {
        model: Permission,
      }
    });
  }

  static async removePermissionsFromRole (roleId: string, permissionIds: string[]) {
    return RolePermission.destroy({
      where: {
        roleId,
        permissionId: {
          [Op.in]: permissionIds
        }
      }
    });
  }

  static async deleteRole (id: string) {
    return Role.destroy({ where: { id } });
  }

  static async checkIfRoleExists (name: string, appId: string) {
    return Role.findOne({ where: { name, applicationId: appId } });
  }

  static async checkPermissionExists (name: string) {
    return Permission.findOne({ where: { name } });
  }

  static async validatePermissionIds (permissionIds: string[], roleId) {
    const allPermission = await Permission.findAll({
      where: {
        id: {
          [Op.in]: permissionIds
        }
      }
    });
    if(permissionIds.length !== allPermission.length) {
      const invalidPermissionIds = permissionIds.filter(id => !allPermission.find(p => p.id === id));
      throw new Error('Invalid Permission Ids: ' +  invalidPermissionIds.join(', '));
    };

    // check if permission already exists for a role
    const rolePermissions = await RolePermission.findAll({
      where: {
        roleId,
        permissionId: {
          [Op.in]: permissionIds
        } 
      }
    });

    if(rolePermissions.length) {
      throw new Error('Some Permission Ids are already attached to this role');
    }
  }

  static async getRole (where: any) {
    return Role.findOne({ where });
  }

  static async checkIfAdminBelongsToApp ({ applicationId, adminId}) {
    return AdminApplication.findOne({
      where: {
        applicationId,
        adminId
      }
    });
  }

  static async getAllPermissions (where: any) {
    return Permission.findAll({ where });
  }

  static async getAminAppIds (adminId: any) {
    const adminApps = await AdminApplication.findAll({
      where: {
        adminId
      }
    });
    if(!adminApps.length) {
      throw new Error('Admin does not belong to any application');
    }
  }

  static async getAllRoles (where: any) {
    return Role.findAll({ where });
  }

  static async createImportRecord (adminId: string, payload: any) {
   const result =  await Document.create({
      ...payload,
      type: 'import',
      status: 'UPLOAD_TO_S3_INITIATED',
      adminId,
      progress: 0,
    });

    return result;
  }

  static async getImportFileWithUploadId (uploadId) {
    return Document.findOne({ where: { uploadId } });
  }

  static async updateDocumentMetaWithUploadId (uploadId, payload) {
    const thisFile = await Document.findOne({ where: { uploadId } });
    if(!thisFile) {
      throw new Error('File not found');
    }

    thisFile.update({
      meta: {
        ...thisFile.meta,
        ...payload
      }
    })
  }

  static async createExportRecord (adminId: string, payload: any) {
    const result =  await Document.create({
      ...payload,
      type: 'export',
      status: 'EXPORT_REQUEST_INITIATED',
      adminId,
      progress: 0,
    });

    return result;
  }

  static async getDocumentWithId (id: string) {
    return Document.findOne({ where: { id } });
  }

  static async getDocuments (where: any) {
    return Document.findAll({ where });
  }

  static async getFormElements (where: any) {
    return FormElement.findAll({ where });
  }

  static async createFormElement (payload: any) {
    return FormElement.create(payload);
  }

  static async updateFormElement (id: string, payload: any) {
    return FormElement.update(payload, { where: { id } });
  }

  static async getTags (where: any) {
    return Tag.findAll({ where });
  }

  static async createTag (payload: any) {
    return Tag.create(payload);
  }

  static async updateTag (id: string, payload: any) {
    return Tag.update(payload, { where: { id } });
  }

  static async deleteFormElement (id: string) {
    return FormElement.destroy({ where: { id } });
  }

  static async getFormElement (where: any = {}) {
    return FormElement.findOne({ where });
  }

  static async getTag (where: any = {}) {
    return Tag.findOne({ where });
  }
};

export default AdminService;