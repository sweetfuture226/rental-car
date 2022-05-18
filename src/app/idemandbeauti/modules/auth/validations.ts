import { validateSchema } from '../../../../utils/joiSetup';
import AuthSchema from './schema';

const registerUser = validateSchema(AuthSchema.registerUserSchema);

const UserValidation = {
  registerUser
}

export default UserValidation;