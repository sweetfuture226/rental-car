export interface IEvent {
  id?: string;
  applicationId: string;
  userId: string;
  resource: string;
  action: string;
  meta?: any;
  createdAt?: Date;
  updatedAt?: Date;
}