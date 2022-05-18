import { Request, Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import ApiResponse from '../../../../utils/response';
import CRMUser from '../../../crm/modules/users';


class Auth {
  static async registerUser (req: IRequest, res: Response) {
      try {
        // check if user already exist on db
        let thisUser = await CRMUser.UserController.createUserInternal(req.body);
        if(thisUser) {
          return ApiResponse.success(res, 200, 'User created successfully', thisUser);
        };    
        return ApiResponse.error(res, 400, 'Operation failed');
      } catch (error) {
          return ApiResponse.error(res, 400, error.message);
      }
  }
}

export default Auth;