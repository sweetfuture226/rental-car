import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createOrganization = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
	description: Joi.string().trim().required(),
}));

const updateOrganization = validateSchema(Joi.object({
  organizationId: Joi.string().trim().required(),
	name: Joi.string().trim().optional(),
	description: Joi.string().trim().optional(),
}));

const deleteOrganization = validateSchema(Joi.object({
  organizationId: Joi.string().trim().required(),
}));

const getOrganizationById = validateSchema(Joi.object({
  organizationId: Joi.string().trim().required(),
}));

const addAdminToOrganization = validateSchema(Joi.object({
  organizationId: Joi.string().trim().required(),
  adminId: Joi.string().trim().required(),
}));

const OrganizationValidation = {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationById,
  addAdminToOrganization
}

export default OrganizationValidation;