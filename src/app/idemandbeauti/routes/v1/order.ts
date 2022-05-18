import { ProductMiddleware } from './../../modules/product';
import express from 'express';
import { AuthMiddleware } from '../../../crm/modules/auth';
import { OrderController, OrderValidation } from '../../modules/order';

const orderRouter = express.Router();

orderRouter.post('/cart/add', 
  AuthMiddleware.UserTokenAuth, 
  OrderValidation.validateProductId,
  ProductMiddleware.productExists,
  OrderController.addItemToCart
);

orderRouter.put('/cart/remove',
  AuthMiddleware.UserTokenAuth, 
  OrderValidation.validateProductId,
  ProductMiddleware.productExists,
  OrderController.removeItemFromCart
);

orderRouter.get('/cart', AuthMiddleware.UserTokenAuth,  OrderController.getCart);

orderRouter.post('/checkout', AuthMiddleware.UserTokenAuth,  OrderValidation.validateAddressId, OrderController.checkout)

export default orderRouter;
