import Joi from 'joi';

const registerUserSchema = Joi.object({
  applicationId: Joi.string().required(),
  phone: Joi.string().trim().required(),
});

const AuthSchema = {
  registerUserSchema,
}

export default AuthSchema;
