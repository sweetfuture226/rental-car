import ApiResponse from '../../../../utils/response';
import { Response, NextFunction } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import StoreService from './dbService';

class StoreMiddleware {
  static async StoreExists(req: IRequest, res: Response, next: NextFunction) {
    const storeId = req.body.storeId || req.params.storeId;
    const Store = await StoreService.getStore({
      id: storeId,
    });
    if(!Store) {
      return ApiResponse.error(res, 400, 'Invalid store');
    }
    return next();
  }
}

export default StoreMiddleware;
