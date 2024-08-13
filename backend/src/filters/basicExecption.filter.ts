import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BasicException } from 'src/exceptions/basic.exception';
import { type Response } from 'express';
import { RESPONSE_CODE } from 'src/constants/api';

@Catch()
export class BasicExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof BasicException) {
      response.status(exception.getStatus()).json({
        code: exception.code,
        message: exception.message,
        data: {},
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        code: RESPONSE_CODE.BAD_REQUEST,
        message: exception.message,
        data: {},
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: RESPONSE_CODE.INTERNAL_SERVER_ERROR,
        message: exception.message,
        data: {},
      });
    }
  }
}
