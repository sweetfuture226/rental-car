import { cleanUpPaginatedData, manageFilters, managePagination, manageSearchFilters } from './../../../../utils/helpers';
import { UserAttribute, UserCreateAttribute, UserInfoAttribute, CampaignAttribute } from "./types";
const Sequelize = require('sequelize');
// @ts-ignore
import db, { Address, User, OptionalUserValue, Application, Campaign, Event, UserApplication, UserCampaign, EmailSmsRecord, EmailSmsUser, FormElement } from '../../../../db/models';
const { Op } = Sequelize;
const sequelize = db.crm;

class UserService {
  static async CreateUserOptionalValues(phone, optionalValues: any = {}) {
    const optionalValuesArr = []
    Object.keys(optionalValues).forEach(key => {
      optionalValuesArr.push({
        phone,
        key,
        value: optionalValues[key]
      })
    });

    return await OptionalUserValue.bulkCreate(optionalValuesArr, { ignoreDuplicates: true });
  }

  static async UpdateOptionalValues(phone: string, optionalValues: any = {}) {
    const optionalValueKeys = Object.keys(optionalValues);

    for (let index = 0; index < optionalValueKeys.length; index++) {
      const key = optionalValueKeys[index];

      await OptionalUserValue.update({
        value: optionalValues[key]
      }, {
        where: {
          phone,
          key
        }
      });
    }
  }

  static async createUser({ applicationId, campaignId, ...userPayload }: UserCreateAttribute) {
    const {
      optionalValues,
      ...createBody
    } = userPayload;
    // createUser 
    const createdUser = await User.create({
      ...createBody,
    });

    // add optional values
    await UserService.CreateUserOptionalValues(createdUser.phone, optionalValues);
    // create user application
    applicationId && await UserApplication.create({
      userId: createdUser.id,
      applicationId,
      meta: {}
    });

    campaignId && await UserCampaign.create({
      userId: createdUser.id,
      campaignId,
    })

    return createdUser;
  }

  static async createCampaign({ slug, ...campaignPayload }: CampaignAttribute) {
    // createCampaign
    const campaign = await Campaign.findOne({
      where: {
        name: campaignPayload?.name
      }
    })
    if (campaign) {
      throw Error('Campaign already exist')
    }

    const createdCampaign = await Campaign.create({
      ...campaignPayload,
      slug: slug || campaignPayload?.name?.replace?.(/\s/g, '_'),
      type: 'campaign'
    });

    return createdCampaign;
  }

  static async updateCampaign(campaignId: string, { ...campaignPayload }: CampaignAttribute) {
    // createCampaign
    const updated = await Campaign.update({
      ...campaignPayload,
    }, { where: { id: campaignId } });

    return updated;
  }

  static async createUserApplication(userId: string, applicationId: string, user: UserAttribute) {
    await UserApplication.create({
      userId,
      applicationId,
      meta: {}
    })

    return await UserService.getUserById(userId)
  }

  static async createUserCampaign(userId: string, campaignId: string) {
    await UserCampaign.create({
      userId,
      campaignId,
      meta: {}
    })

    return await UserService.getUserById(userId)
  }

  static async createBulkUserCampaign(campaignId: string, userIds: any[]) {
    const bulkUserCampaign = userIds.map(user => {
      return {
        userId: user.id,
        campaignId
      }
    })
    return await UserCampaign.bulkCreate(bulkUserCampaign, { ignoreDuplicates: true }); //
  }

  static async updateUser(id: string, payload: UserAttribute & { optionalValues: any }) {
    // const res = await User.update(payload, { where: { id } });
    const thisUser = await User.findOne({ where: { id } });
    if (!thisUser) throw new Error('Invalid User');
    await thisUser.update(payload);
    await UserService.UpdateOptionalValues(thisUser.phone, payload?.optionalValues);
    return thisUser;
  }

  static async updateUserApplication(userAppId: string, payload: UserAttribute) {
    return await UserApplication.update(payload, { where: { id: userAppId } });
  }

  static async deleteUser(id: string) {
    return await User.destroy({ where: { id } });
  }

  static async getUserById(id: string) {
    return await User.findOne({
      where: { id },
      include: [
        {
          model: UserApplication,
          attributes: ['id'],
          include: {
            model: Application,
            attributes: ['name']
          }
        },
        {
          model: OptionalUserValue,
        }
      ]
    });
  }

  static async getAppUserById(id: string, applicationId) {
    return await User.findOne({
      where: { id },
      include: [
        {
          model: UserApplication,
          attributes: ['id'],
          include: {
            model: Application,
            attributes: ['name']
          }
        }
      ]
    });
  }

  static async checkUserApplication(userId: string, applicationId: string) {
    return UserApplication.findOne({ where: { userId: userId, applicationId } });
  }

  static async checkUserCampaign(userId: string, campaignId: string) {
    return UserCampaign.findOne({ where: { userId: userId, campaignId } });
  }

  static async validateCampaignId(id: string) {
    const rec = Campaign.findOne({ where: { id } });
    if (!rec) throw new Error('Invaid Campaign');
  }

  static async getUserByEmail(email: string) {
    return await User.findOne({
      where: { email },
      include: [
        {
          model: UserApplication,
          attributes: ['id'],
          include: {
            model: Application,
            attributes: ['name']
          }
        },
      ]
    });
  }

  static async getUserByPhone(phone: string) {
    return await User.findOne({
      where: { phone },
      include: [
        {
          model: UserApplication,
          attributes: ['id'],
          include: {
            model: Application,
            attributes: ['name']
          }
        }
      ]
    });
  }

  static async checkEmailAndPhoneUniqueness({ email, phone }) {
    const thisUser = await User.findOne({
      where: {
        [Op.or]: [{
          email
        },
        {
          phone
        }
        ]
      }
    });

    return thisUser;
  }

  static async getUsers(where: any = {}) {
    return await User.findAll(
      {
        where,
        include: [
          {
            model: OptionalUserValue,
            attributes: ['key', 'value']
          }
        ]
      }
    );
  }

  static async getAppUsers(filters: any) {
    return await User.findAll(
      {
        include: [
          {
            model: UserApplication,
            where: {
              applicationId: filters.applicationId
            }
          },
        ]
      }
    );
  }

  static async getAllUsers(filters: any) {
    const queryObj: any = {
      include: [,
      ]
    }
    if (filters.applicationId) {
      queryObj.include.push({
        model: UserApplication,
        where: {
          applicationId: filters.applicationId
        }
      })
    }

    return await User.findAll(
      {
        ...queryObj
      }
    );
  }

  static async getCampaign(where: any = {}) {
    return Campaign.findOne(
      {
        where,
        include: EmailSmsRecord
      }
    );
  }

  static async getCampaigns(where: any = {}, { page = 1, pageSize = 10, filters = {}, sort = {}, search = '' }: any = {}) {
    const { limit, offset } = managePagination(page, pageSize);
    const campaigns = await Campaign.findAndCountAll(
      {
        limit,
        offset,
        where,
      }
    );

    return cleanUpPaginatedData(campaigns, { page, pageSize });
  }

  static async getAllCampaignsNoPagination() {
    return Campaign.findAll(
      {
      }
    );
  }

  static async validateCampaignOwner(ownerId, campaignId) {
    const campaignOwner = await Campaign.findOne({
      where: {
        id: campaignId
      }
    });
    if (!campaignOwner) throw new Error('Invalid Campaign. Campaign not found');
    if (campaignOwner.ownerId !== ownerId) throw new Error('Invalid Campaign. Campaign does not belong to you!');
  }

  static async getCampaignUsers(campaignId: string, { page = 1, pageSize = 100, filters = {}, sortField = 'createdAt', orderBy = 'DESC', search = '' }) {
    const { limit, offset } = managePagination(page, pageSize);

    const orderArr =
      sortField !== 'paymentStatus'
        ?
        [[sortField, orderBy]]
        :
        [
          [{ model: UserCampaign }, 'paymentStatus', orderBy],
        ]
      ;

    const queryObj: any = {
      limit,
      offset,
      order: orderArr,
      include: [
        {
          model: UserCampaign,
          attributes: ['campaignId', 'userId', 'paymentStatus'],
          where: {
            campaignId
          }
        },
        {
          model: OptionalUserValue,
          attributes: ['key', 'value']
        }
      ]
    }

    //Add filters 
    const where = manageFilters(filters, Op)
    if (where && (Object.keys(where))) queryObj.where = where

    const leads = await User.findAndCountAll(queryObj);
    return cleanUpPaginatedData(leads, { page, pageSize });
  }

  static async getAllLeads({ page = 1, pageSize = 10, filters = {}, sortField = 'createdAt', orderBy = 'DESC', search = '' }: any) {
    const { limit, offset } = managePagination(page, pageSize);


    const queryObj: any = {
      limit,
      offset,
      order: [[sortField, orderBy]],
      distinct: true,
      include: {
        model: OptionalUserValue,
        attributes: ['key', 'value'],
      }
    }
    //Add filters 
    const where = manageFilters(filters, Op)
    if (where && (Object.keys(where))) queryObj.where = where

    const leads = await User.findAndCountAll(queryObj);
    return cleanUpPaginatedData(leads, { page, pageSize });
  }

  static async getFormElements() {
    const res = await FormElement.findAll({});
    const optionals = [];
    const mainVals = [];
    res?.forEach(element => {
      if (element.type === 'mainValues') {
        mainVals.push(element?.name);
      } else {
        optionals.push(element?.name);
      }
    });

    return { mainVals, optionals };
  }

  static async getLeadsDataPoints({ filters = {}, search = '' }: any) {
    const queryObj: any = {
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col('id')), "filteredCount"],
        [Sequelize.literal(`sum(case when gender like 'M%' then 1 else 0 end)`), 'malecount'],
        [Sequelize.literal(`sum(case when gender like 'F%' then 1 else 0 end)`), 'femalecount']
      ],
      where: {},
      raw: true,
    }
    //Add filters 
    const where = manageFilters(filters, Op)
    if (where && (Object.keys(where))) queryObj.where = where

    const totalCount = await User.count();
    const result = await User.findAll(queryObj)

    // const allMales =
    return ({
      totalCount,
      ...(result ? result?.[0] : {}),
    });
  }

  static async createEmailSmsRecord(payload) {
    const createdEmailSmsRecord = await EmailSmsRecord.create(payload);
    return createdEmailSmsRecord
  }

  static async createEmailSmsUser(payload) {
    const createdEmailSmsUser = await EmailSmsUser.create(payload);
    return createdEmailSmsUser
  }

  static async createBulkEmailSmsUser(emailSmsId: string, users: any[]) {
    const bulkEmailSmsUser = users.map(user => {
      return {
        emailSmsId,
        userId: user.id,
        email: user.email,
        phone: user.phone

      }
    })

    return await EmailSmsUser.bulkCreate(bulkEmailSmsUser, { ignoreDuplicates: true });
  }

  static async getAllEmailSmsRecord() {
    const allEmailSmsRecord = await EmailSmsRecord.findAll({});
    return allEmailSmsRecord
  }

  static async getEmailSmsRecord(where: any = {}) {
    const emailSmsRecord = await EmailSmsRecord.findOne({
      where,
    });
    return emailSmsRecord
  }

  static async getEmailSmsUser(where: any = {}) {
    const emailSmsRecord = await EmailSmsUser.findAll({
      where,
      include: { model: User, as: 'lead', attributes: ['id', 'firstName', 'lastName', 'phone'] }
    });
    return emailSmsRecord
  }

  static async updateEmailSmsUser(id, payload) {
    const updatedEmailSmsUser = await EmailSmsUser.findOne({
      where: {
        id
      }
    })
    await updatedEmailSmsUser.update(payload);
    return updatedEmailSmsUser
  }


  static async addAddress(payload) {
    const createdAddress = await Address.create(payload);
    return createdAddress
  }

  static async getAllAddress(where: any = {}) {
    const allAddress = await Address.findAll({
      where
    });
    return allAddress
  }

  static async updateAddress(id, payload) {
    const updatedAddress = await Address.findOne({
      where: {
        id
      }
    })
    await updatedAddress.update(payload);
    return updatedAddress
  }

  static async getAddress(where: any = {}) {
    const address = await Address.findOne({
      where
    });
    return address
  }

  static async searchAllLeads({ filters = {}, search = '' }: any) {
    const { mainVals, optionals } = await UserService.getFormElements();
    //Add filters 
    const { mainValueArr, optionalValueArr } = manageSearchFilters(filters, Op, { mainVals, optionals })

    const tempSQL = sequelize.dialect.queryGenerator.selectQuery('OptionalUserValues', {
      attributes: ['phone'],
      where: optionalValueArr
    })
      .slice(0, -1)
    // @ts-ignore
    // mainValueArr?.phone?.[Op.in] = Sequelize.literal(`(${tempSQL})`)
    const queryObj: any = {
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col('User.id')), "filteredCount"],
        [Sequelize.literal(`sum(case when gender like 'M%' then 1 else 0 end)`), 'malecount'],
        [Sequelize.literal(`sum(case when gender like 'F%' then 1 else 0 end)`), 'femalecount']
      ],
      where: {
        ...mainValueArr,
        phone: {
          [Op.in]: sequelize.literal(`(${tempSQL})`),
        }
      }
    };

    const totalCount = await User.count();
    const result = await User.findAll(queryObj)

    return ({
      totalCount,
      result: result?.[0] || {},
    });
  }

  static async getPropertyValues(field: any) {
    const { mainVals, optionals } = await UserService.getFormElements();
    let res;
    if (optionals.includes(field.label)) {
      res = await OptionalUserValue.findAll({
        // distinct: 'value',
        where: {
          key: field.label,
          value: {
            [Op.like]: `%${field.value}%`,
          }
        },
        limit: 100,
        attributes: ['key', 'value'],
      });
    } else if (mainVals.includes(field.label)) {
      res = await User.findAll({
        // distinct: 'value',
        where: {
          [field.label]: field.value,
        },
        limit: 100,
        attributes: [field.label],
      });
    }
    return { propertyValues: res };
  }

  static async getAvailableUsersForAnAdmin(adminId, { page = 1, pageSize = 10, filters = {}, sortField = 'createdAt', orderBy = 'DESC', search = '' }: any) {
    const { limit, offset } = managePagination(page, pageSize);
    const queryObj: any = {
      limit,
      offset,
      order: [[sortField, orderBy]],
      where: {
        [Op.or]: [
          {
            uploadedBy: adminId
          },
          {
            id: {
              [Op.in]: sequelize.literal(`(SELECT
                "userId"
              FROM
                "UserCampaigns" AS user_campaigns,
                "Campaigns" AS campaigns
              WHERE
                campaigns.id = user_campaigns. "campaignId"
                AND campaigns. "ownerId" = '${adminId}')`)
            }
          }
        ],
      }
    }

    if (filters.location) {
      queryObj.where.location = filters.location
    }

    if (filters.gender) {
      queryObj.where.gender = {
        [Op.like]: `${filters.gender}%`
      }
    }

    const leads = await User.findAndCountAll(queryObj);
    return cleanUpPaginatedData(leads, { page, pageSize });
  }
};

export default UserService;
