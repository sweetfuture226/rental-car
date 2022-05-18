import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createApplication = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
	description: Joi.string().trim().required(),
  slug: Joi.string().trim().required(),
}));

const updateApplication = validateSchema(Joi.object({
  applicationId: Joi.string().trim().required(),
	name: Joi.string().trim().optional(),
	description: Joi.string().trim().optional(),
}));

const deleteApplication = validateSchema(Joi.object({
  applicationId: Joi.string().trim().required(),
}));

const getApplicationById = validateSchema(Joi.object({
  applicationId: Joi.string().trim().required(),
}));

const addAdminToApplication = validateSchema(Joi.object({
  applicationId: Joi.string().trim().required(),
  adminId: Joi.string().trim().required(),
}));

const ApplicationValidation = {
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationById,
  addAdminToApplication
}

export default ApplicationValidation;