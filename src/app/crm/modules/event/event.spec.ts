import supertest from 'supertest';
import { app } from '../../../../server';
//@ts-ignore
import db from '../../../../db/models';
import EventService from './dbService';
import {
  createDummyUser,
  generateDummyAccessKeyAndApp,
} from '../../../../tests/helpers';

const server = supertest(app);

describe('Event test case scenario', () => {
  let record;
  let dummyUser;
  beforeEach(async () => {
    try {
      await db.crm.dialect.sequelize.truncate({ cascade: true });
      record = await generateDummyAccessKeyAndApp();
      dummyUser = await createDummyUser(record);
    } catch (err) {
      // logger(err);
    }
  });
  test('should create an event', async () => {
    const res = await server
      .post('/api/v1/event')
      .set('accesskey', record?.credentials?.key)
      .send({
        userId: dummyUser?.id,
        action: 'write test for event',
        resource: 'test',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Event created successfully');
    expect(res.body.data.userId).toBe(dummyUser?.id);
  });
  test('get all events', async () => {
    await EventService.createEvent({
      userId: dummyUser?.id,
      action: 'write test for event',
      resource: 'test',
      applicationId: record?.application?.id,
    });
    const res = await server
      .get('/api/v1/event')
      .set('accesskey', record?.credentials?.key);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Events retrieved successfully');
    expect(res.body.data.length).toBe(1);
  });
  test('should get a single event', async () => {
    const result = await EventService.createEvent({
      userId: dummyUser?.id,
      action: 'write test for event',
      resource: 'test',
      applicationId: record?.application?.id,
    });
    const res = await server
      .get(`/api/v1/event/${result.id}`)
      .set('accesskey', record?.credentials?.key);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Event retrieved successfully');
    expect(res.body.data.id).toBe(result.id);
  });
});
