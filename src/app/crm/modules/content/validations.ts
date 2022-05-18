import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createUIContent = validateSchema(Joi.object({
  page: Joi.string().trim().required(),
  type: Joi.string().trim().required(),
  content: Joi.object().required(),
  resource: Joi.string().trim().required(), 
  meta: Joi.object().optional(),
}));

const updateUIContent = validateSchema(Joi.object({
  contentId: Joi.string().trim().required(),
  page: Joi.string().trim().optional(),
  type: Joi.string().trim().optional(),
  content: Joi.object().optional(),
  resource: Joi.string().trim().optional(), 
  meta: Joi.object().optional(),
}));

const deleteUIContent = validateSchema(Joi.object({
  contentId: Joi.string().trim().required(),
}));

const getUIContentById = validateSchema(Joi.object({
  contentId: Joi.string().trim().required(),
}));

const getUIContentAllowedQueries = validateSchema(Joi.object({
  resource: Joi.string().trim().optional(),
  page: Joi.string().trim().optional(),
  type: Joi.string().trim().optional(),
}));

const UIContentValidation = {
  createUIContent,
  updateUIContent,
  deleteUIContent,
  getUIContentById,
  getUIContentAllowedQueries
}

export default UIContentValidation;