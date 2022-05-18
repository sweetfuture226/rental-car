import ApplicationService from "../app/crm/modules/application/dbService";
import UIContentService from "../app/crm/modules/content/dbService";
import UserService from "../app/crm/modules/users/dbService";
//@ts-ignore
import { Role, Admin } from '../db/models';
import generateRolesAndPermissions from "../utils/generateRolesAndPermissionDefaultRecords";
import { passwordHasher } from "../utils/helpers";
import JWT from "../utils/jwt";

export const dummyUserRecord = { 
    firstName: 'kelvin',
    lastName: 'ese',
    phone: '2348104127524',
    email: 'kevo@ese',
    address: 'test',
    city: 'test',
    state: 'test',
    country: 'test',
    postalCode: 'test',
}


export const crmUserRecord = { 
  firstName: 'kelvin',
  lastName: 'ese',
  phone: '2348104127524',
  email: 'kevo@ese',
  instagramId: 'kelvin',
  age: 30,
  campaignId: ''
}
  

export const generateDummyAccessKeyAndApp = async (name: string = "test", description: string = "test") => {
  return ApplicationService.createApplication({ name: name, description: description, slug: name.replace(/\s/g, '')});
}

export const generateDummyCampaign = async (name: string = "test-campaign", description: string = "test") => {
  return UserService.createCampaign({ name: name, description: description, type: 'campaign', slug: name.replace(/\s/g, '')});
}

export const createDummyUser = async (record) => {
  const createdUser = await UserService.createUser({ applicationId: record?.app?.id,...dummyUserRecord});
  return createdUser;
}

export const createDummyUIContent = async () => {
  const createdUIContent = await UIContentService.createUIContent({ 
    resource: 'quik-influence',
    page: 'Home', 
    type: 'navbar', 
    content:  { navigationName: ['Home', 'View', 'pay']}
  });
  return createdUIContent;
}

export const getUserById = async (id) => {
  return await UserService.getUserById(id);
}

export const seedInSuperAdminAndRoles = async () => {
  // seed in roles
  const roles = [
    {
      name: 'superadmin',
    },
    {
      name: 'admin',
    },
    {
      name: 'default',
    },
    {
      name: 'appowner'
    }
  ];

  const createdRoles = await Role.bulkCreate(roles);
  const passwordHash = await passwordHasher('password');
  const superAdminRole = await Role.findOne({ where: { name: 'superadmin' } });
  const createdSuperAdmin = await Admin.create({
    firstName: 'Alliance',
    lastName: 'SuperAdmin',
    email: 'superadmin@alliancedevelopment.com',
    phone: '+1 (917) 585-3181',
    password: passwordHash,
    roleId: superAdminRole?.id,
  });

  // run permission scripts
  await generateRolesAndPermissions();
};


export const generateAdmintoken = async (email: string) => {
  const admin = await Admin.findOne({ where: { email }, 
   include: {
    model: Role,
    as: 'role',
    attributes: ['name'],
   }
  });
  return JWT.sign(admin.dataValues);
}

export const getSuperAdminRole = async () => Role.findOne({ where: { name: 'superadmin' } });

export const createDummyAdmin = async (record) => {
  const passwordHash = await passwordHasher('password');
  const adminRole = await Role.findOne({ where: { name: 'admin' } });
  const createdAdmin = await Admin.create({
    firstName: 'test',
    lastName: 'Admin',
    email: record.email || 'testadmin@alliance.com',
    phone: '+1 (917) 585-3181',
    password: passwordHash,
    roleId: adminRole?.id,
  });

  return createdAdmin;
}