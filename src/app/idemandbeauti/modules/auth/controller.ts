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

  static async addAddress (req: IRequest, res: Response) {
    try {
      // check if address already exist on db
      let thisAddress = await CRMUser.UserDBService.getAddress({
        applicationId: req.application.id,
        userId: req.decodedUser.id,
        type: 'delivery-address',
        address: req.body.address,
      }); 
      if(thisAddress) {
        return ApiResponse.success(res, 200, 'Address already exists', thisAddress);
      };

       thisAddress = await CRMUser.UserDBService.addAddress({
        ...req.body, 
        applicationId: req.application.id,
        userId: req.decodedUser.id,
        type: 'delivery-address'
      });
      
        return ApiResponse.success(res, 200, 'Address created successfully', thisAddress);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateAddress (req: IRequest, res: Response) {
    try {
      // check if address already exist on db
      let thisAddress = await CRMUser.UserDBService.getAddress({
        applicationId: req.application.id,
        id: req.params.addressId,
      }); 
      if(!thisAddress) {
        return ApiResponse.error(res, 400, 'Address does not exists');
      };

       await thisAddress.update({
        ...req.body,
       });
      
      return ApiResponse.success(res, 200, 'Address updated successfully', thisAddress);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteAddress (req: IRequest, res: Response) {
    try {
      // check if address already exist on db
      let thisAddress = await CRMUser.UserDBService.getAddress({
        applicationId: req.application.id,
        id: req.params.addressId,
      }); 
      if(!thisAddress) {
        return ApiResponse.error(res, 400, 'Address does not exists');
      };

       await thisAddress.destroy();
      
      return ApiResponse.success(res, 200, 'Address deleted successfully', thisAddress);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getAllAddress (req: IRequest, res: Response) {
    try {
      // check if address already exist on db
      let addresses = await CRMUser.UserDBService.getAllAddress({
        applicationId: req.application.id,
        userId: req.decodedUser.id,
        type: 'delivery-address'
      }); 

       return ApiResponse.success(res, 200, 'Addresses retrieved successfully', addresses);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getSingleAddress (req: IRequest, res: Response) {
    try {
      // check if address already exist on db
      let thisAddress = await CRMUser.UserDBService.getAddress({
        applicationId: req.application.id,
        id: req.params.addressId,
      }); 
      if(!thisAddress) {
        return ApiResponse.error(res, 400, 'Address does not exists');
      };

       return ApiResponse.success(res, 200, 'Address retrieved successfully', thisAddress);
    } catch (error) {
        return ApiResponse.error(res, 400, error.message);
    }
  }
}

export default Auth;