import {
  seedInSuperAdminAndRoles,
  generateAdmintoken,
  getSuperAdminRole,
} from '../../../../tests/helpers';
import supertest from 'supertest';
import { app } from '../../../../server';
//@ts-ignore
import db from '../../../../db/models';
import AdminService from './dbService';
import { passwordHasher } from '../../../../utils/helpers';
import logger from '../../../../utils/logger';

const server = supertest(app);

describe('Admin test case scenario', () => {
  let dummyAdminObj: any;
  let adminToken: string;
  beforeEach(async () => {
    try {
      await db.crm.dialect.sequelize.truncate({ cascade: true });
      await seedInSuperAdminAndRoles();
      adminToken = await generateAdmintoken(
        'superadmin@alliancedevelopment.com',
      );
      const passwordHash = await passwordHasher('password');
      const superAdminRole = await getSuperAdminRole();
      dummyAdminObj = {
        email: 'test@email.com',
        phone: '2340506969095',
        firstName: 'test',
        lastName: 'last',
        password: passwordHash,
        roleId: superAdminRole.id,
      };
    } catch (err) {
      console.log(err);
    }
  });
  test('should create an admin', async () => {
    const { roleId, ...admin } = dummyAdminObj;
    const res = await server
      .post('/api/v1/admin')
      .set('token', adminToken)
      .send(admin);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Admin created successfully');
    // confirm admin in db
  });
  test('should register an admin', async () => {
    const { roleId, ...admin } = dummyAdminObj;
    const res = await server
      .post('/api/v1/admin/register')
      .send(admin);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Admin registered successfully');
    // confirm admin in db
  });
  test('should login an admin', async () => {
    const res = await server.post('/api/v1/admin/login').send({
      email: 'superadmin@alliancedevelopment.com',
      password: 'password',
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Admin logged in successfully');
  });
  test('get all admins', async () => {
    await AdminService.createAdmin(dummyAdminObj);
    const res = await server.get('/api/v1/admin').set('token', adminToken);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Admins retrieved successfully');
    expect(res.body.data.length).toBe(2); // new admin and super admin
  });

  test('should get a single admin', async () => {
    const result = await AdminService.createAdmin(dummyAdminObj);
    const res = await server
      .get(`/api/v1/admin/${result.id}`)
      .set('token', adminToken);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Admin retrieved successfully');
    expect(res.body.data.id).toBe(result.id);
  });
  test('should update an Admin', async () => {
    const result = await AdminService.createAdmin(dummyAdminObj);
    const res = await server
      .patch(`/api/v1/admin/${result.id}`)
      .set('token', adminToken)
      .send({
        phone: '1340506969095',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Admin updated successfully');
    expect(res.body.data.phone).toBe('1340506969095');
  });
});
