import { Response } from 'express';
import logger from './logger';


class ApiResponse {
  static error(res: Response, code: number, message: string) {
    //@ts-ignore
    logger('Error:', `Error-response: on url ${res?.req?.originalUrl}. Message ==> ${message} status-code: ${code}`);
    return res.status(code).send({
      status: code,
      message,
    });
  }

  static success(
    res: Response,
    code: number,
    message: string = 'Success',
    data?: any
  ) {
    return res.status(code).send({
      status: code,
      message,
      data,
    });
  }
}

export default ApiResponse;
