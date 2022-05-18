import { createDummyUIContent, seedInSuperAdminAndRoles } from './../../../../tests/helpers';
import supertest from 'supertest';
import { app } from '../../../../server';
//@ts-ignore
import db from '../../../../db/models';
import UIContentService from './dbService';
import {
  generateAdmintoken,
} from '../../../../tests/helpers';
import logger from '../../../../utils/logger';

const server = supertest(app);

describe('UIContent test case scenario', () => {
  let dummyContentObj: any = {
    resource: 'quik-test',
    page: 'Settings', 
    type: 'navbar', 
    content:  { navigationName: ['Home', 'View', 'pay']}
  };
  let adminToken: string;
  let uiContentRec = {id: ''};
  beforeEach(async () => {
    try {
      await db.crm.dialect.sequelize.truncate({ cascade: true });
      await seedInSuperAdminAndRoles();
      adminToken = await generateAdmintoken(
        'superadmin@alliancedevelopment.com',
      );
      uiContentRec = await createDummyUIContent();
    } catch (err) {
      logger(err);
    }
  });
  test('should create a ui page content for navbar', async () => {
    const res = await server
      .post('/api/v1/content')
      .set('token', adminToken)
      .send(dummyContentObj);
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('UIContent created successfully');
    // confirm ui content in db
    const uiContent = await UIContentService.getUIContent({ id: res.body.data.id})
    expect(uiContent).toBeTruthy()
  });

  test('should get ui page contents', async () => {
    const res = await server
      .get('/api/v1/content')
      .set('token', adminToken)
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('UIContents retrieved successfully');
  });

  test('should update page content', async () => {
    const res = await server
      .patch(`/api/v1/content/${uiContentRec.id}`)
      .set('token', adminToken)
      .send({
        resource: 'quik-patch'
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('UIContent updated successfully');
    const getUpdatedContent = await UIContentService.getUIContent({ id: uiContentRec.id})
    expect(getUpdatedContent.resource).toEqual('quik-patch')
  });

  test('should delete page content', async () => {
    const res = await server
      .delete(`/api/v1/content/${uiContentRec.id}`)
      .set('token', adminToken)

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('UIContent deleted successfully');
    const getUpdatedContent = await UIContentService.getUIContent({ id: uiContentRec.id})
    expect(getUpdatedContent).toBeFalsy();
  });
});
