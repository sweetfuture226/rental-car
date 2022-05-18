import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createEvent = validateSchema(Joi.object({
  userId: Joi.string().trim().required(),
	applicationId: Joi.string().trim().required(),
  resource: Joi.string().trim().required(),
  action: Joi.string().trim().required(),
}));

const updateEvent = validateSchema(Joi.object({
  applicationId: Joi.string().trim().required(),
  eventId: Joi.string().trim().required(),
	userId: Joi.string().trim().optional(),
	action: Joi.string().trim().optional(),
  resource: Joi.string().trim().optional(),
}));

const deleteEvent = validateSchema(Joi.object({
  eventId: Joi.string().trim().required(),
  applicationId: Joi.string().trim().optional(),
}));

const getEventById = validateSchema(Joi.object({
  eventId: Joi.string().trim().required(),
  applicationId: Joi.string().trim().optional(),
}));

const EventValidation = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
}

export default EventValidation;