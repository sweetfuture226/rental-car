import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createUser = validateSchema(Joi.object({
  applicationId: Joi.string().required(),
  phone: Joi.string().trim().required(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  postalCode: Joi.string().trim().optional(),
  gender: Joi.string().lowercase().valid('male', 'female', 'other').trim().optional(),
  address2: Joi.string().trim().optional(),
  address3: Joi.string().trim().optional(),
  dateOfBirth: Joi.string().trim().optional(),
  optionalValues: Joi.object().optional(),
}));

const createUserByAdmin = validateSchema(Joi.object({
  phone: Joi.string().trim().required(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  postalCode: Joi.string().trim().optional(),
  gender: Joi.string().lowercase().valid('male', 'female', 'other').trim().optional(),
  address2: Joi.string().trim().optional(),
  address3: Joi.string().trim().optional(),
  dateOfBirth: Joi.string().trim().optional(),
  optionalValues: Joi.object().optional(),
}));

const updateUserProfile = validateSchema(Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().trim().optional(),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  postalCode: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  address2: Joi.string().trim().optional(),
  address3: Joi.string().trim().optional(),
  dateOfBirth: Joi.string().trim().optional(),
  avatar: Joi.string().trim().optional(),
}));

const createUserCampaign = validateSchema(Joi.object({
  campaignId: Joi.string().required(),
  phone: Joi.string().trim().min(3).max(20).required(),
  firstName: Joi.string().min(1).max(20).trim().required(),
  lastName: Joi.string().min(1).max(20).trim().required(),
  email: Joi.string().min(3).max(40).trim().required(),
  gender: Joi.string().lowercase().valid('male', 'female', 'other').trim().required(),
  address: Joi.string().trim().required(),
  address2: Joi.string().trim().optional(),
  address3: Joi.string().trim().optional(),
  dateOfBirth: Joi.date().required(),
  state: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  postalCode: Joi.string().trim().required(),
  instagramId: Joi.string().optional(),
  facebookHandle: Joi.string().optional(),
  twitterHandle: Joi.string().optional(),
  tiktokHandle: Joi.string().optional(),
  optionalValues: Joi.object().optional(),
}));

const updateUser = validateSchema(Joi.object({
  applicationId: Joi.string().required(),
  id: Joi.string().trim().required(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().email().trim().optional(),
  address: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  postalCode: Joi.string().trim().optional(),
  gender: Joi.string().trim().optional(),
  address2: Joi.string().trim().optional(),
  address3: Joi.string().trim().optional(),
  socialMediaHandle: Joi.string().max(100).optional(),
  dateOfBirth: Joi.string().trim().optional(),
  avatar: Joi.string().trim().optional(),
  optionalValues: Joi.object().optional(),
}));

const deleteUser = validateSchema(Joi.object({
  applicationId: Joi.string().optional(),
  id: Joi.string().trim().required(),
}));

const getUserById = validateSchema(Joi.object({
  applicationId: Joi.string().optional(),
  id: Joi.string().trim().required(),
}));

const validatePhone = validateSchema(Joi.object({
  applicationId: Joi.string().required(),
  phone: Joi.string().trim().required(),
}));

const userLogin = validateSchema(Joi.object({
  applicationId: Joi.string().required(),
  phone: Joi.string().trim().required(),
  otp: Joi.string().trim().required(),
}));

const createCampaign = validateSchema(Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  formData: Joi.object().optional(),
  redirectUrl: Joi.string().trim().optional(),
  banner: Joi.string().trim().optional(),
  paidType: Joi.string().valid('PAID', 'UNPAID').default('UNPAID').trim(),
  campaignDate: Joi.date().optional(),
  slug: Joi.string().trim().optional(),
  prices: Joi.string().optional(),
  status: Joi.string().optional(),
  optionalValues: Joi.array().items(Joi.string()).optional(),
  // for EmailSMS Campaign
  to: Joi.array().optional(),
  message: Joi.string().optional(),
  timezone: Joi.string().optional(),
  type: Joi.string().optional(),
  mediaUrls: Joi.array().optional(),

}));

const updateCampaign = validateSchema(Joi.object({
  campaignId: Joi.string().required(),
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  formData: Joi.object().optional(),
  redirectUrl: Joi.string().trim().optional(),
  banner: Joi.string().trim().optional(),
  paidType: Joi.string().valid('PAID', 'UNPAID').default('UNPAID').trim().optional(),
  status: Joi.string().optional(),
  campaignDate: Joi.date().optional(),
  slug: Joi.string().trim().optional(),
  facebookHandle: Joi.string().optional(),
  twitterHandle: Joi.string().optional(),
  prices: Joi.string().optional(),
  tiktokHandle: Joi.string().optional(),
  instagramHandle: Joi.string().optional(),
}));

const getCampaignById = validateSchema(Joi.object({
  campaignId: Joi.string().trim().required(),
}));

const getCampaignReports = validateSchema(Joi.object({
  messageId: Joi.string().trim().required(),
}));


const paymentIntent = validateSchema(Joi.object({
  paymentMethodType: Joi.string().trim().required(),
  amount: Joi.number().required(),
  currency: Joi.string().max(10).required(),
}));

const createChargeCredit = validateSchema(Joi.object({
  amount: Joi.number().required(),
  email: Joi.string().email().max(70).required(),
}));

const registerUser = validateSchema(Joi.object({
  applicationId: Joi.string().required(),
  phone: Joi.string().trim().required(),
}));

const addAddress = validateSchema(Joi.object({
  address: Joi.string().required(),
  state: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  postalCode: Joi.string().trim().required(),
}));

const updateAddress = validateSchema(Joi.object({
  addressId: Joi.string().required(),
  address: Joi.string().optional(),
  state: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  postalCode: Joi.string().trim().optional(),
}));

const validateAddressId = validateSchema(Joi.object({
  addressId: Joi.string().required()
}));

const validateGetOwnLeads = validateSchema(Joi.object({
  filters: Joi.object({
    gender: Joi.string().valid('M', 'F').optional(),
    location: Joi.string().optional()
  }).optional(),
  page: Joi.number().optional(),
  pageSize: Joi.number().optional(),
}));

const UserValidation = {
  createChargeCredit,
  paymentIntent,
  createUser,
  createUserCampaign,
  createCampaign,
  updateUser,
  deleteUser,
  getUserById,
  validatePhone,
  userLogin,
  registerUser,
  getCampaignById,
  getCampaignReports,
  updateCampaign,
  updateUserProfile,
  createUserByAdmin,
  addAddress,
  updateAddress,
  validateAddressId,
  validateGetOwnLeads
}

export default UserValidation;