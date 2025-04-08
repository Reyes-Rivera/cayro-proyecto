import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from './logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal Server Error';

    const stack = exception instanceof Error ? exception.stack : undefined;

    const shouldIgnore =
      request.url === '/auth/verifyToken' &&
      exception instanceof UnauthorizedException;

    if (!shouldIgnore) {
      this.logger.error({
        message: 'Excepción no controlada',
        method: request.method,
        path: request.url,
        statusCode: status,
        errorMessage: message,
        trace: stack,
        context: 'AllExceptionsFilter',
      });
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
