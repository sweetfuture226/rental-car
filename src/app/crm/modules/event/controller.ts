import { Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import EventService from './dbService';


class Event {
  static async createEvent (req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      const created = await EventService.createEvent(req.body);

      return ApiResponse.success(res, 200, 'Event created successfully', created);
    } catch (error) {
       return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateEvent (req: IRequest, res: Response) {
    try {
      const record = req.body;
      const thisEvent = await EventService.getEvent({id: req.params.eventId});
     // confirm if this event exist
      if(!thisEvent) {
        return ApiResponse.error(res, 400, 'Event does not exist');
      }
       await EventService.updateEvent(thisEvent.id, record);
       const event = await EventService.getEvent({id: thisEvent.id});
      return ApiResponse.success(res, 200, 'Event updated successfully', event);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteEvent (req: IRequest, res: Response) {
    try {
      
     return ApiResponse.success(res, 200, 'Event deleted successfully', null);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getEvents (req: IRequest, res: Response) {
    try {
      const events = await EventService.getEvents(req.query);
       return ApiResponse.success(res, 200, 'Events retrieved successfully', events);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getEventById (req: IRequest, res: Response) {
    try {
      const event = await EventService.getEvent({id: req.params.eventId});
      return ApiResponse.success(res, 200, 'Event retrieved successfully', event);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }
}

export default Event;