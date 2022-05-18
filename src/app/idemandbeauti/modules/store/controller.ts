import { Request, Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import StoreDBService from './dbService';


class StoreController {
  static async createStore (req: IRequest, res: Response) {
      try {
        // check if store already exist on db
        const thisStore = await StoreDBService.getStore({name: req.body.name});
        if(thisStore) {
          // confirm if this store has already been created
          return ApiResponse.success(res, 400, 'Store name already exists', null);
        }
        const store = await StoreDBService.createStore({ 
          ...req.body, 
          status: 'active',
          vendorId: req.body.organizationId,
          createdBy: req.decoded.id,
          updatedBy: req.decoded.id
        });
        if(store) {
          return ApiResponse.success(res, 200, 'Store created successfully', store);
        };    
        return ApiResponse.error(res, 400, 'Operation failed');
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async updateStore (req: IRequest, res: Response) {
      try {
        const record = req.body;
        // validarte store admin
        await StoreDBService.validateStoreAdmin(req.params.storeId, req.decoded.id);
        // check if store already exist on db
        const store = await StoreDBService.updateStore(req.params.storeId, {...record, updatedBy: req.decoded.id});
        if(store) {
         return ApiResponse.success(res, 200, 'Store updated successfully', store);
        };
        return ApiResponse.error(res, 400, 'Store update failed');
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async deleteStore (req: IRequest, res: Response) {
      try {
        await StoreDBService.validateStoreAdmin(req.params.storeId, req.decoded.id);
        const store = await StoreDBService.deleteStore(req.params.storeId);
        if(store) {
          return ApiResponse.success(res, 200, 'Store deleted successfully', {});
        };    
        return ApiResponse.error(res, 400, 'Operation failed');
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async getStores (req: IRequest, res: Response) {
    try {
      // fetch all applications by an ordinary admin
      const adminId = req.decoded ? req.decoded.id : null;
      const queryParams: { page: number; pageSize: number, favourite?: string } = req.query as any || {};
      const stores = await StoreDBService.getStores({}, adminId, req?.decodedUser?.id, queryParams);
      return ApiResponse.success(res, 200, 'Stores retrieved successfully', stores);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getStore (req: IRequest, res: Response) {
      try {
        // fetch all applications by an ordinary admin
        const store = await StoreDBService.getStore({id: req.params.storeId}, req?.decodedUser?.id, true);
        return ApiResponse.success(res, 200, 'Store retrieved successfully', store);
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }

  static async addStoreToFavourite (req: IRequest, res: Response) {
    try {
      await StoreDBService.addStoreToFavourite(req.params.storeId, req.decodedUser.id);
      return ApiResponse.success(res, 200, 'Store added to favourite successfully', {});
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async removeStoreFromFavourite (req: IRequest, res: Response) {
    try {
      await StoreDBService.removeStoreFromFavourite(req.params.storeId, req.decodedUser.id);
      return ApiResponse.success(res, 200, 'Store removed from favourite successfully', {});
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }
}

export default StoreController;