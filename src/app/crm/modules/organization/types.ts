export interface IOrganization {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IOrganizationCreate {
  name: string;
  description: string;
  ownerId: string;
}

export interface IOrganizationUpdate {
  name?: string;
  description?: string;
}