import { Schema } from 'joi';
import {  Request, Response, NextFunction } from 'express';
import ApiResponse from './response';

export const validateSchema = (schema: Schema)  => async (request: Request & { cleaned: any}, response: Response, next: NextFunction) => {
    try {
      const body = { ...request.body, ...request.params, ...request.query };  
      const validated = await schema.validateAsync(body);
      request.cleaned = validated;
     return next();
    } catch (error) {
      return ApiResponse.error(response, 400, error.message);
    }
};

export interface IRequest extends Request {
  cleaned: any;
  headers: any;
  admin: any;
  application: any;
  decoded: any;
  decodedUser: any;
  isAllowed?: boolean;
}