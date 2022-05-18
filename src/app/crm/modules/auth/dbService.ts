//@ts-ignore
import { Admin, Role, Application, AdminApplication, Permission, RolePermission } from '../../../../db/models';

class AuthService  {
  static async checkAdminPermissions ({roleId, permission}: any) {
    return RolePermission.findAll({ 
      where:{
        roleId
      },
      include: {
        model: Permission,
        where: {
          name: permission
        }
      }
  });
  }
};

export default AuthService;