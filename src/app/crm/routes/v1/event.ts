import express from 'express';
import { ApplicationMiddleware } from '../../modules/application';
import { EventController, EventValidation} from '../../modules/event';

const eventRouter = express.Router();

eventRouter.get(
  '/',
  ApplicationMiddleware.validateAppAccessKey,
  EventController.getEvents
);

eventRouter.get(
  '/:eventId',
  ApplicationMiddleware.validateAppAccessKey,
  EventValidation.getEventById,
  EventController.getEventById
);

eventRouter.patch(
  '/:eventId',
  ApplicationMiddleware.validateAppAccessKey,
  EventValidation.updateEvent,
  EventController.updateEvent
);

eventRouter.post(
  '/',
  ApplicationMiddleware.validateAppAccessKey,
  EventValidation.createEvent,
  EventController.createEvent
);


export default eventRouter;
