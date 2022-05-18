import { Response } from 'express';
import { IRequest } from '../../../../utils/joiSetup';
import logger from '../../../../utils/logger';
import ApiResponse from '../../../../utils/response';
import UIContentService from './dbService';


class UIContent {
  static async createUIContent (req: IRequest, res: Response) {
    try {
      // check if user already exist on db
      const thisUIContent = await UIContentService.getUIContent({page: req.body.page, resource: req.body.resource,  type: req.body.type});
     // confirm if this event exist
      if(thisUIContent) {
        return ApiResponse.error(res, 400, 'UIContent already exist for this resource and page');
      }

      const created = await UIContentService.createUIContent(req.body);

      return ApiResponse.success(res, 200, 'UIContent created successfully', created);
    } catch (error) {
       return ApiResponse.error(res, 400, error.message);
    }
  }

  static async updateUIContent (req: IRequest, res: Response) {
    try {
      const record = req.body;
      const thisUIContent = await UIContentService.getUIContent({id: req.params.contentId});
     // confirm if this event exist
      if(!thisUIContent) {
        return ApiResponse.error(res, 400, 'UIContent does not exist');
      }
       await UIContentService.updateUIContent(thisUIContent.id, record);
       const event = await UIContentService.getUIContent({id: thisUIContent.id});
      return ApiResponse.success(res, 200, 'UIContent updated successfully', event);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async deleteUIContent (req: IRequest, res: Response) {
    try {
      await await UIContentService.deleteUIContent(req.params.contentId);
     return ApiResponse.success(res, 200, 'UIContent deleted successfully', null);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getUIContents (req: IRequest, res: Response) {
    try {
      logger('Info: Get UI content endpoint')
      const events = await UIContentService.getUIContents(req.query);
      logger('Info: Successful DB Call for UI info')
       return ApiResponse.success(res, 200, 'UIContents retrieved successfully', events);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }

  static async getUIContentById (req: IRequest, res: Response) {
    try {
      const event = await UIContentService.getUIContent({id: req.params.contentId});
      return ApiResponse.success(res, 200, 'UIContent retrieved successfully', event);
    } catch (error) {
      return ApiResponse.error(res, 400, error.message);
    }
  }
}

export default UIContent;