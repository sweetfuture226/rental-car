export interface IStore {
  id: string;
  name: string;
  description: string;
  vendorId: string;
  banner: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  createdBy: string;
  updatedBy: string;
  openTime: Date;
  closeTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStoreCreate {
  name: string;
  description: string;
  vendorId: string;
  banner: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  createdBy: string;
  updatedBy: string;
  openTime: Date;
  closeTime: Date;
}

export interface IStoreUpdate {
  name?: string;
  description?: string;
  banner?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  updatedBy: string;
  openTime: Date;
  closeTime: Date;
}