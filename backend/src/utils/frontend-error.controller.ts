import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AppLogger } from 'src/utils/logger.service';

@Controller('logs')
export class FrontendErrorController {
  constructor(private readonly logger: AppLogger) {}

  @Post('frontend-error')
  @HttpCode(HttpStatus.OK)
  logFrontendError(@Body() data: any) {
    console.log("object");
    this.logger.error({
      message: data.message || 'Error sin mensaje',
      stack: data.stack || null,
      context: data.context || 'frontend',
      timestamp: data.timestamp || new Date().toISOString(),
      path: data.path || null,
      userAgent: data.userAgent || null,
    });

    return { status: 'ok', message: 'Error registrado correctamente' };
  }
}
