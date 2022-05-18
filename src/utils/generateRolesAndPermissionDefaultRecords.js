const { Op } =require('sequelize');
const permissionRecords = require('./permissionsForRole.json');
// @ts-ignore
const db = require('../db/models');

const { Permission, Admin, RolePermission, Role } = db;
const getSuperAdmin = async () => {
  return Admin.findOne({
    where: {
      email: 'superadmin@alliancedevelopment.com'
    }
  })
}

const createPermissions = async () => {
  try {
  const superAdmin = await getSuperAdmin();

  const permissionCreateArr =  permissionRecords.superadmin.map(name => ({
    name,
    description: name.split('_').join(' '),
    createdBy: superAdmin.id,
    updatedBy: superAdmin.id
  }));

  // create permission
  await Permission.bulkCreate(permissionCreateArr, { ignoreDuplicates: true });
} catch (error) {
    console.log(error.message, 'all permission creation failed')
}
}

const createRolePermission = async (permissionIds, role) => {
  try {
    const thisRole = await Role.findOne({
      where: {
        name: role
      }
    });
    if(!thisRole) {
      throw Error ('invalid role')
    };
    const createArr = permissionIds.map(permissionId => ({permissionId, roleId: thisRole.id}));
    await RolePermission.bulkCreate(createArr, { ignoreDuplicates: true })
  } catch (error) {
    console.log(error.message)
  }

};

const getPermissionIds = async (permissionNames) => {
  const permissions = await Permission.findAll({
    where: {
      name: {
         [Op.in]: permissionNames
      }
    }
  });
  const permissionIds = permissions.map(({dataValues}) => { 
    return dataValues?.id
  });
  return permissionIds;
}

const generateRolesAndPermissions = async () => {
  try {
      // create permissions
      await createPermissions();

      for (const role in permissionRecords) {
        const permissions = permissionRecords[role];
        if(permissions.length) {
          const permissionIdsForRole = await getPermissionIds(permissions);
          await createRolePermission(permissionIdsForRole,  role);
        }
      }
  } catch (error) {
      console.log(error.message)
  }

}

module.exports = generateRolesAndPermissions;

