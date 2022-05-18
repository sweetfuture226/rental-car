export interface IAdmin {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  email: string;
  roleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdminUpdate {
  firstName: string;
  lastName: string;
  phone: string;
  stripeAcctId?: string;
}

export interface IAdminCreate {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}