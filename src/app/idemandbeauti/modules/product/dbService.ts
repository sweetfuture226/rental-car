import { OrganizationDBService } from './../../../crm/modules/organization/index';
import { cleanUpPaginatedData, generateRandomAccessKeyString, managePagination } from '../../../../utils/helpers';
import { IProductCreate } from "./types";
//@ts-ignore
import { Product, Store, Favourite, Category } from '../../../../db/models';

class ProductDBService  {
  static async createProduct (payload: IProductCreate) {
     const createdProduct = await Product.create(payload);
    return createdProduct;  
  }

  static async updateProduct (id: string, payload: IProductCreate) {
    const thisProduct = await Product.findOne({ where: { id } });
    if(!thisProduct) throw new Error('Product not found');
    return Product.update(payload, { where: { id } }, { returning: true });
  }

  static async deleteProduct (id: string) {
    const thisProduct = await Product.findOne({ where: { id } });
    if(!thisProduct) throw new Error('Product not found');
    return Product.destroy({ where: { id } });
  }

  static async getProduct (where: any, userId: string | null = null) {
    let filterObj: any = {
      include: [
        {
          model: Store,
          where: {}
      },
      {
        model: Category,
        attributes: ['name', 'id'],
      }
      ]
    };
    if(userId) {
      filterObj.include.push({
        model: Favourite,
        where: {
          userId
        },
        attributes: ['productId'],
        required: false,
      })
    }
    return Product.findOne({ 
      where,
      ...filterObj
    });
  }

  static async getProducts (where: any = {}, 
    adminId: string | null = null, 
    userId: string | null = null, 
    query: {page: number, pageSize: number, favourite: string}
  ) {
    const { page = 1, pageSize = 10, favourite } = query || {};
    const { limit, offset } = managePagination(page, pageSize);
    let filterObj: any = {
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      where,
      include: [
        {
          model: Store,
          where: {}
      },
      {
        model: Category,
        attributes: ['name', 'id'],
      }
      ]
    };
    if(adminId) {
      const orgIds = await OrganizationDBService.getAdminOrgIDs(adminId);
      if(orgIds?.length) {
        filterObj.include[0].where = {
          vendorId: orgIds,
        }
        filterObj.include[0].attributes = [];
    }
    }
    if(userId) {
      filterObj.include.push({
        model: Favourite,
        where: {
          userId
        },
        attributes: ['productId'],
        required: favourite === 'true',
      })
    }

    const products = await Product.findAndCountAll(filterObj);

    return cleanUpPaginatedData(products, { page, pageSize });
  }

  static async addProductToFavourite (productId: string, userId: string) {
    return Favourite.create({
      productId,
      userId,
    })
  };

  static async removeProductFromFavourite (productId: string, userId: string) {
    return Favourite.destroy({
      where: {
        productId,
        userId,
      }
    })
  };

  static async getCategory (where: any) {
    return Category.findOne({
      where,
    })
  };

  static async addCategory ({ name, description}: { name: string, description: string }) {
    const thisCategory = await ProductDBService.getCategory({ name });
    if(thisCategory) throw new Error('Category already exists');
    return Category.create({
      name,
      description,
    })
  }

  static async updateCategory (id: string, { name, description}: { name: string, description: string }) {
    const thisCategory = await ProductDBService.getCategory({ name });
    if(thisCategory) throw new Error('Category with name already exists');
    return Category.update({
      name,
      description,
    }, {
      where: {
        id,
      }
    })
  }

  static async deleteCategory (id: string) {
    return Category.destroy({
      where: {
        id,
      }
    })
  }

  static async getCategories (where: any = {}) {
    return Category.findAll({
      where,
    })
  }
};

export default ProductDBService;