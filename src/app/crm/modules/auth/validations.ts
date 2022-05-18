import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const registerAdminOTP = validateSchema(Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
	phone: Joi.string().trim().required(),
  applicationId: Joi.string().trim().optional(),
}));

const registerAdminInternal = validateSchema(Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
	phone: Joi.string().trim().required(),
  applicationId: Joi.string().trim().required(),
}));

const getOTPForLogin = validateSchema(Joi.object({
  email: Joi.string().email().trim().required(),
}));

const createPassword = validateSchema(Joi.object({
  password: Joi.string().trim().min(8).required(),
  otp: Joi.string().trim().required(),
}));

const loginAdminOTP = validateSchema(Joi.object({
  email: Joi.string().email().trim().required(),
  otp: Joi.string().trim().required(),
}));

const loginAdminPassword = validateSchema(Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
}));


const AuthValidation = {
  registerAdminOTP,
  registerAdminInternal,
  getOTPForLogin,
  loginAdminOTP,
  loginAdminPassword,
  createPassword
}

export default AuthValidation;