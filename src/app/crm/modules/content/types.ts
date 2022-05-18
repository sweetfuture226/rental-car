export interface IUIContent {
  id: string;
  type: string;
  page: string;
  content: any;
  resource: string;
  meta?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUIContentCreate {
  type: string;
  page: string;
  content: any;
  resource: string;
  meta?: any;
}

export interface IUIContentUpdate {
  type?: string;
  page?: string;
  content?: any;
  resource?: string;
  meta?: any;
}