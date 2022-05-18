import { OtpServices } from './../otp/index';
import {
  crmUserRecord,
  createDummyUser,
  dummyUserRecord,
  generateDummyAccessKeyAndApp,
  generateDummyCampaign,
  getUserById,
} from '../../../../tests/helpers';
import supertest from 'supertest';
import { app } from '../../../../server';
import db from '../../../../db/models';
import UserService from './dbService';
import logger from '../../../../utils/logger';

const server = supertest(app);

describe('Users test case scenario', () => {
  let record = { credentials: { key: '' }, app: {id: ''} };
  let campaignCreated = { id: ''}
  beforeEach(async () => {
    try {
      await db.crm.dialect.sequelize.truncate({ cascade: true });
      const created = await generateDummyAccessKeyAndApp();
      campaignCreated = await generateDummyCampaign()
      record = created;
    } catch (err) {
      logger(err);
    }
  });

  test('should create a user', async () => {
    const res = await server
      .post('/api/v1/users')
      .set('accesskey', record.credentials.key)
      .send(dummyUserRecord);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User created successfully');
  });

  test('should create a campaign user without an application', async () => {
    crmUserRecord.campaignId = campaignCreated.id
    const res = await server
      .post('/api/v1/users/campaign')
      .send(crmUserRecord);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User created successfully');
  });

  test('should create a campaign user if user already exist but not tied to campaign', async () => {
    const dummy = await createDummyUser({ app: {}});
    crmUserRecord.campaignId = campaignCreated.id;
    crmUserRecord.email = dummy.email;
    const res = await server
      .post('/api/v1/users/campaign')
      .send(crmUserRecord);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User created successfully');
    const allUsers = await UserService.getUsers({});
    expect(allUsers?.length).toEqual(1);
    const UserCampaign = await UserService.checkUserCampaign(res.body?.data?.id, campaignCreated?.id);
    expect(UserCampaign).toBeTruthy()
  });

  test('should create a userApp if user already exist', async () => {
    await createDummyUser(record);
    const newRecord = await generateDummyAccessKeyAndApp('newname', 'newdesc');
    const res = await server
      .post('/api/v1/users')
      .set('accesskey', newRecord.credentials.key)
      .send(dummyUserRecord);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User created successfully');
  });

  test('should update a user', async () => {
    const dummy = await createDummyUser(record);
    const res = await server
      .put(`/api/v1/users/${dummy.id}`)
      .set('accesskey', record.credentials.key)
      .send({
        firstName: 'updated',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User updated successfully');

    const updated = await getUserById(dummy.id);
    expect(updated.firstName).toEqual('updated');
  });

  test('should get a single user by id', async () => {
    const dummy = await createDummyUser(record);
    const res = await server
      .get(`/api/v1/users/${dummy.id}`)
      .set('accesskey', record.credentials.key);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User retrieved successfully');
    expect(res.body?.data?.id).toEqual(dummy.id);
  });

  test('should get all users', async () => {
    const dummy = await createDummyUser(record);
    const res = await server
      .get(`/api/v1/users`)
      .set('accesskey', record.credentials.key);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Users retrieved successfully');
    expect(res.body?.data?.[0]?.id).toEqual(dummy.id);
  });

  test('should get otp for a user', async () => {
    const dummy = await createDummyUser(record);
    const res = await server
      .get(`/api/v1/users/otp/${dummy.phone}`)
      .set('accesskey', record.credentials.key);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('OTP sent successfully');
  });

  test('should login user', async () => {
    const dummy = await createDummyUser(record);
    await OtpServices.createOtpForUserLogin({entityId: dummy.id, applicationId: record.app.id, userInfo: dummy})
    const res = await server
      .post(`/api/v1/users/login`)
      .send({
        phone: dummy.phone,
        otp: '01122'
      })
      .set('accesskey', record.credentials.key);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('User logged in successfully');
  });
});
