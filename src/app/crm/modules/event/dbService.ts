import { generateRandomAccessKeyString } from '../../../../utils/helpers';
import { IEvent } from "./types";
//@ts-ignore
import { Event, AccessKey } from '../../../../db/models';

class EventService  {
  static async getEventAccessKey (where: any) {
    return AccessKey.findOne({ where });
  }

  static async createEvent (payload: IEvent): Promise<IEvent> {
    // create Event 
     const createdEvent = await Event.create(payload);
    return createdEvent;  
  }

  static async updateEvent (id: string, payload: IEvent) {
    return Event.update(payload, { where: { id } });
  }

  static async deleteEvent (id: string) {
    return Event.destroy({ where: { id } });
  }

  static async getEvent (where: any) {
    return Event.findOne({ 
      where,
    });
  }

  static async getEvents (where: any = {}) {
    return Event.findAll(
      {
        where,
      }
    );
  }
};

export default EventService;