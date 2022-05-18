import ApiResponse from '../../../../utils/response';
import { Response, NextFunction } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ProductService from './dbService';

class ProductMiddleware {
  static async productExists(req: IRequest, res: Response, next: NextFunction) {
    const productId = req.body.productId || req.params.productId;
    const product = await ProductService.getProduct({
      id: productId,
    });
    if(!product) {
      return ApiResponse.error(res, 400, 'Invalid product');
    }
    return next();
  }
}

export default ProductMiddleware;
