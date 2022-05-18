import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createProduct = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  storeId: Joi.string().trim().required(),
  imageUrl: Joi.string().trim().required(),
  status: Joi.string().trim().optional().default('active'),
  price:Joi.number().required(),
  meta: Joi.object().optional(),
}));

const updateProduct = validateSchema(Joi.object({
  productId: Joi.string().trim().required(),
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  imageUrl: Joi.string().trim().optional(),
  status: Joi.string().trim().optional(),
  price:Joi.number().optional(),
  meta: Joi.object().optional(),
}));

const deleteProduct = validateSchema(Joi.object({
  productId: Joi.string().trim().required(),
}));

const getProductById = validateSchema(Joi.object({
  productId: Joi.string().trim().required(),
}));

const categoryId = validateSchema(Joi.object({
  categoryId: Joi.string().trim().required(),
}));

const createCategory = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
}));

const updateCategory = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  categoryId: Joi.string().trim().required(),
}));

const ProductValidation = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  categoryId,
  createCategory,
  updateCategory,
}

export default ProductValidation;