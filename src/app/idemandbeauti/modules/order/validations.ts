import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const validateProductId = validateSchema(Joi.object({
  productId: Joi.string().trim().required(),
}));

const validateAddressId = validateSchema(Joi.object({
  addressId: Joi.string().trim().required(),
}));

const ProductValidation = {
  validateProductId,
  validateAddressId
}

export default ProductValidation;