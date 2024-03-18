import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter {
  catch(exception: AxiosError, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception);

    if (!exception.response) {
      return response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    response.status(exception.response.status).json(exception.response.data);
  }
}
