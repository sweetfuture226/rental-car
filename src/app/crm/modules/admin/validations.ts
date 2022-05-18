import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createAdmin = validateSchema(Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().trim().required(),
	phone: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
}));

const updateAdmin = validateSchema(Joi.object({
  adminId: Joi.string().trim().required(),
	firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
	phone: Joi.string().trim().optional(),
  address1: Joi.string().trim().optional(),
  address2: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  dateOfBirth: Joi.date().optional(),
  city: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  zipCode: Joi.string().trim().optional(),
}));

const updateAdminProfile = validateSchema(Joi.object({
	firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
	phone: Joi.string().trim().optional(),
  address1: Joi.string().trim().optional(),
  address2: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  dateOfBirth: Joi.date().optional(),
  city: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  zipCode: Joi.string().trim().optional(),
  avatar: Joi.string().trim().optional(),
}));

const deleteAdmin = validateSchema(Joi.object({
  adminId: Joi.string().trim().required(),
}));

const getAdminById = validateSchema(Joi.object({
  adminId: Joi.string().trim().required(),
}));

const loginAdmin = validateSchema(Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().trim().required(),
}));

const createRole = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  applicationId: Joi.string().trim().required(),
}));

const createRoleInternal = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
}));

const createPermission = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
}));

const attachPermissionToRole = validateSchema(Joi.object({
  roleId: Joi.number().required(),
  permissionIds: Joi.array().items(Joi.string()).required(),
}));

const exportRequest = validateSchema(Joi.object({
  filters: Joi.object().required(),
  sort: Joi.object({
    field: Joi.string().required(),
    order: Joi.string().valid('ASC', 'DESC').required(),
  }).optional(),
  skipRecords: Joi.number().optional(),
  maxRecords: Joi.number().optional(),
  attributes: Joi.array().items(Joi.string()).required(),
}));

export const validateDocId = validateSchema(Joi.object({
  documentId: Joi.string().trim().required(),
}));

export const createFormElement = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  meta: Joi.object().optional(),
}));

export const updateFormElement = validateSchema(Joi.object({
  formId: Joi.string().trim().required(),
  name: Joi.string().trim().optional(),
  meta: Joi.object().optional(),
}));

export const validateFormId = validateSchema(Joi.object({
  formId: Joi.string().trim().required(),
}));

export const createTag = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  meta: Joi.object().optional(),
}));

export const updateTag = validateSchema(Joi.object({
  tagId: Joi.string().trim().required(),
  name: Joi.string().trim().optional(),
  meta: Joi.object().optional(),
}));

const AdminValidation = {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  loginAdmin,
  createRole,
  createPermission,
  attachPermissionToRole,
  createRoleInternal,
  updateAdminProfile,
  exportRequest,
  validateDocId,
  createFormElement,
  updateFormElement,
  validateFormId,
  createTag,
  updateTag
}

export default AdminValidation;