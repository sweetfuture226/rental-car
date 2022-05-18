export interface IProduct {
  id: string;
  name: string;
  description: string;
  storeId: string;
  imageUrl: string;
  status: string;
  price: number;
  meta?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductCreate {
  name: string;
  description: string;
  storeId: string;
  imageUrl: string;
  status: string;
  price: number;
  meta?: any;
}

export interface IProductUpdate {
  name?: string;
  description?: string;
  imageUrl?: string;
  status?: string;
  price?: number;
  meta?: any;
}