import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createStore = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  banner: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
  contactEmail: Joi.string().email().trim().required(),
  contactPhone: Joi.string().trim().required(),
  openTime: Joi.string().trim().optional(),
  closeTime: Joi.string().trim().optional(),
  meta: Joi.object().optional(),
  organizationId: Joi.string().trim().required(),
}));

const updateStore = validateSchema(Joi.object({
  storeId: Joi.string().trim().required(),
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  status: Joi.string().trim().optional(),
  banner: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  contactEmail: Joi.string().trim().optional(),
  contactPhone: Joi.string().trim().optional(),
  openTime: Joi.string().trim().optional(),
  closeTime: Joi.string().trim().optional(),
  meta: Joi.object().optional(),
}));

const deleteStore = validateSchema(Joi.object({
  storeId: Joi.string().trim().required(),
}));

const getStoreById = validateSchema(Joi.object({
  storeId: Joi.string().trim().required(),
}));

const StoreValidation = {
  createStore,
  updateStore,
  deleteStore,
  getStoreById,
}

export default StoreValidation;