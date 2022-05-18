import { managePagination, cleanUpPaginatedData } from './../../../../utils/helpers';
import { generateRandomAccessKeyString } from '../../../../utils/helpers';
import { IStoreCreate } from "./types";
//@ts-ignore
import db, { Store, Store, Favourite } from '../../../../db/models';
import OrganizationService from '../../../crm/modules/organization/dbService';

const sequelize = db.idemandbeauti;

class StoreDBService  {
  static async createStore (payload: IStoreCreate) {
     const createdStore = await Store.create(payload);
    return createdStore;  
  }

  static async updateStore (id: string, payload: IStoreCreate) {
    const thisStore = await Store.findOne({ where: { id } });
    if(!thisStore) throw new Error('Store not found');
    const res = await Store.update(payload, { where: { id } });
    if(res) {
      return Store.findOne({ where: { id } });
    }
  }

  static async deleteStore (id: string) {
    const thisStore = await Store.findOne({ where: { id } });
    if(!thisStore) throw new Error('Store not found');
    return Store.destroy({ where: { id } });
  }

  static async getCategoriesAvailableForStore (storeId: string) {
    const storeCategories =  await sequelize.query(`    
      SELECT
      "Categories"."name" AS category,
      sum(
        CASE WHEN "Products"."categoryId" = "Categories"."id" THEN
          1
        ELSE
          0
        END) AS records
      FROM
      "Categories",
      "Products"
      WHERE
      "Products"."storeId" = '${storeId}'
      GROUP BY
      "Categories"."name";
    `, {
       type: sequelize.QueryTypes.SELECT
    });

    return storeCategories;
  }

  static async getStore (where: any = {}, userId: string | null = null, showCategories: boolean = false) {
    let queryObj: any = {
      where,
    }
    if (userId) {
      queryObj.include = [
        {
          model: Favourite,
          where: {
            userId
          },
          attributes: ['storeId'],
          required: false,
        }
      ]
    }
    const record = await Store.findOne(queryObj);

    if(record?.dataValues && showCategories) {
      const storeCategories = await StoreDBService.getCategoriesAvailableForStore(record.id);
      record.dataValues.storeCategories = storeCategories;
    }

    return record
  }

  static async getStores (where: any = {}, 
    adminId: string | null = null,
    userId: string | null = null,
    query: {page: number, pageSize: number, favourite?: string}
    ) {
    const { page = 1, pageSize = 10, favourite } = query || {};
    const { limit, offset } = managePagination(page, pageSize);
    let queryObj: any = {
      limit,
      offset,
      where,
      order: [['createdAt', 'DESC']],
    }
    if(adminId) {
      const orgIds = await OrganizationService.getAdminOrgIDs(adminId);
      if(orgIds?.length) {
        queryObj.where.vendorId = orgIds;
      } else return []
    }
    if (userId) {
      queryObj.include = [
        {
          model: Favourite,
          where: {
            userId
          },
          attributes: ['storeId'],
          required: favourite === 'true',
        }
      ]
    }
    const stores = await Store.findAndCountAll(queryObj);
    return cleanUpPaginatedData(stores, { page, pageSize });
  }

  static async validateStoreAdmin (storeId: string, adminId: string) {
    const thisStore = await Store.findOne({ where: { id: storeId } });
    if(!thisStore) throw new Error('Store not found');

    const adminOrg = await OrganizationService.getAdminOrganization(thisStore.vendorId, adminId);
    if(!adminOrg) throw new Error('Store admin not found');
    return thisStore;
  }
 
  static async addStoreToFavourite (storeId: string, userId: string) {
    return Favourite.create({
      storeId,
      userId,
    })
  };

  static async removeStoreFromFavourite (storeId: string, userId: string) {
    return Favourite.destroy({
      where: {
        storeId,
        userId,
      }
    })
  };
};

export default StoreDBService;