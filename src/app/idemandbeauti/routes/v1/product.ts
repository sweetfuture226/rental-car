import { ProductMiddleware } from './../../modules/product/index';
import express from 'express';
import { AuthMiddleware } from '../../../crm/modules/auth';
import { ProductController, ProductValidation } from '../../modules/product';

const productRouter = express.Router();

productRouter.post('/admin', AuthMiddleware.AdminTokenAuth, ProductValidation.createProduct, ProductController.createProduct);

productRouter.post('/admin/category', AuthMiddleware.AdminTokenAuth, ProductValidation.createCategory, ProductController.createCategory);

productRouter.get('/admin/category', AuthMiddleware.UserTokenAuthIfExist, ProductController.getCategories);

productRouter.put('/admin/category/:categoryId', AuthMiddleware.AdminTokenAuth, ProductValidation.updateCategory, ProductController.updateCategory);

productRouter.delete('/admin/category/:categoryId', AuthMiddleware.AdminTokenAuth, ProductValidation.categoryId, ProductController.deleteCategory);

productRouter.put('/admin/:productId', AuthMiddleware.AdminTokenAuth, ProductValidation.updateProduct, ProductController.updateProduct);

productRouter.get('/admin', AuthMiddleware.AdminTokenAuth, ProductController.getProducts);

productRouter.get('/', AuthMiddleware.UserTokenAuthIfExist, ProductController.getProducts);

productRouter.get('/:productId', AuthMiddleware.UserTokenAuthIfExist, ProductMiddleware.productExists, ProductController.getProduct);

productRouter.get('/admin/:productId', AuthMiddleware.AdminTokenAuth, ProductMiddleware.productExists, ProductController.getProduct);

productRouter.post('/favourite/:productId', AuthMiddleware.UserTokenAuth, ProductMiddleware.productExists, ProductController.addProductToFavourite);

productRouter.delete('/favourite/:productId', AuthMiddleware.UserTokenAuth, ProductMiddleware.productExists, ProductController.removeProductFromFavourite);

productRouter.delete('/admin/:productId', AuthMiddleware.AdminTokenAuth, ProductValidation.deleteProduct, ProductController.deleteProduct);

export default productRouter;
