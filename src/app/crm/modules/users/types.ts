export interface UserInfoAttribute {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  birthDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CampaignAttribute {
  id?: string;
  name: string;
  description?: string;
  slug: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAttribute extends UserInfoAttribute {
  applicationId: string;
}

export interface UserCreateAttribute extends Omit<UserInfoAttribute, 'phone' > {
  phone: string;
  applicationId?: string;
  campaignId?: string;
  optionalValues?: any;
}