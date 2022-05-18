import { validateSchema } from '../../../../utils/joiSetup';
import Joi from 'joi';

const createSession = validateSchema(
  Joi.object({
    email: Joi.string().email().trim().required(),
    image: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    amount: Joi.number().required(),
    campaignId: Joi.string().required(),
  }),
);

const AuthValidation = {
  createSession,
};

export default AuthValidation;
