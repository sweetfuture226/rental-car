import { StoreMiddleware } from './../../modules/store/index';
import { AuthMiddleware } from './../../../crm/modules/auth';
import express from 'express';
import { StoreController, StoreValidation } from '../../modules/store';
import { OrganizationMiddleware } from '../../../crm/modules/organization';

const storeRouter = express.Router();

storeRouter.post('/admin', AuthMiddleware.AdminTokenAuth, StoreValidation.createStore, OrganizationMiddleware.ValidateAdminOrganization, StoreController.createStore);

storeRouter.put('/admin/:storeId', AuthMiddleware.AdminTokenAuth, StoreValidation.updateStore, StoreController.updateStore);

storeRouter.get('/', AuthMiddleware.UserTokenAuthIfExist, StoreController.getStores);

storeRouter.get('/admin', AuthMiddleware.AdminTokenAuth, StoreController.getStores);

storeRouter.get('/:storeId', AuthMiddleware.UserTokenAuthIfExist, StoreValidation.getStoreById, StoreController.getStore);

storeRouter.get('/admin/:storeId', AuthMiddleware.AdminTokenAuth, StoreValidation.getStoreById, StoreController.getStore);

storeRouter.delete('/admin/:storeId', AuthMiddleware.AdminTokenAuth, StoreValidation.deleteStore, StoreController.deleteStore);

storeRouter.post('/favourite/:storeId', AuthMiddleware.UserTokenAuth, StoreMiddleware.StoreExists, StoreController.addStoreToFavourite);

storeRouter.delete('/favourite/:storeId', AuthMiddleware.UserTokenAuth, StoreMiddleware.StoreExists, StoreController.removeStoreFromFavourite);

export default storeRouter;
