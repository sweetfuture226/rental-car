import { Request, Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import { StoreDBService } from '../store';
import ProductDBService from './dbService';


class ProductController {
  static async createProduct (req: IRequest, res: Response) {
      try {
        // validate store admin
        await StoreDBService.validateStoreAdmin(req.body.storeId, req.decoded.id);
        // check if product already exist on db
        const product = await ProductDBService.createProduct({
          ...req.body,
          createdBy: req.decoded.id,
          updatedBy: req.decoded.id
        });
        if(product) {
          return ApiResponse.success(res, 200, 'Product created successfully', product);
        };    
        return ApiResponse.error(res, 400, 'Operation failed');
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async updateProduct (req: IRequest, res: Response) {
      try {
        const record = req.body;
        // check if product already exist on db
        const thisProduct = await ProductDBService.getProduct({id: req.params.productId});
        if(!thisProduct) {
          return ApiResponse.error(res, 400, 'Product not found');
        }
        await StoreDBService.validateStoreAdmin(thisProduct.storeId, req.decoded.id);
        const product = await ProductDBService.updateProduct(req.params.productId, record);
        await thisProduct.reload();
        if(product) {
          return ApiResponse.success(res, 200, 'Product updated successfully', thisProduct);
        };    
        return ApiResponse.error(res, 400, 'Operation failed');
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async deleteProduct (req: IRequest, res: Response) {
      try {
        const thisProduct = await ProductDBService.getProduct({id: req.params.productId});
        if(!thisProduct) {
          return ApiResponse.error(res, 400, 'Product not found');
        }
        await StoreDBService.validateStoreAdmin(thisProduct.storeId, req.decoded.id);
        const product = await ProductDBService.deleteProduct(req.params.productId);
        if(product) {
          return ApiResponse.success(res, 200, 'Product deleted successfully');
        };    
        return ApiResponse.error(res, 400, 'Operation failed');
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async getProducts (req: IRequest, res: Response) {
      try {
        // fetch all applications by an ordinary admin
        const adminId = req.decoded ? req.decoded.id : null;
        const queryParams: { page: number; pageSize: number, favourite: any } = req.query as any || {};
        const products = await ProductDBService.getProducts({}, adminId, req?.decodedUser?.id, queryParams);
        return ApiResponse.success(res, 200, 'Products retrieved successfully', products);
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async getProduct (req: IRequest, res: Response) {
      try {
        // fetch all applications by an ordinary admin
        const product = await ProductDBService.getProduct({id: req.params.productId}, req?.decodedUser?.id);
        return ApiResponse.success(res, 200, 'Product retrieved successfully', product);
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async addProductToFavourite (req: IRequest, res: Response) {
    try {
      // fetch all applications by an ordinary admin
      await ProductDBService.addProductToFavourite(req.params.productId, req.decodedUser.id);
      return ApiResponse.success(res, 200, 'Product added to favourite successfully', {});
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async removeProductFromFavourite (req: IRequest, res: Response) {
    try {
      // fetch all applications by an ordinary admin
      await ProductDBService.removeProductFromFavourite(req.params.productId, req.decodedUser.id);
      return ApiResponse.success(res, 200, 'Product removed from favourite successfully', {});
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async createCategory (req: IRequest, res: Response) {
    try {
      // check if product already exist on db
      const category = await ProductDBService.addCategory({
        ...req.body,
      });
      return ApiResponse.success(res, 200, 'Category created successfully', category);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateCategory (req: IRequest, res: Response) {
    try {
      const record = req.body;
      // check if product already exist on db
      const thisCategory = await ProductDBService.getCategory({id: req.params.categoryId});
      if(!thisCategory) {
        return ApiResponse.error(res, 400, 'Category not found');
      }
      await ProductDBService.updateCategory(req.params.categoryId, record);
      await thisCategory.reload();
      return ApiResponse.success(res, 200, 'Category updated successfully', thisCategory);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteCategory (req: IRequest, res: Response) {
    try {
      const thisCategory = await ProductDBService.getCategory({id: req.params.categoryId});
      if(!thisCategory) {
        return ApiResponse.error(res, 400, 'Category not found');
      }
      await ProductDBService.deleteCategory(req.params.categoryId);
      return ApiResponse.success(res, 200, 'Category deleted successfully');
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }
  
  static async getCategories (req: IRequest, res: Response) {
    try {
      const categories = await ProductDBService.getCategories();
      return ApiResponse.success(res, 200, 'Categories retrieved successfully', categories);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

}

export default ProductController;