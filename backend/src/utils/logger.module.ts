// src/utils/logger.module.ts
import { Global, Module } from '@nestjs/common';
import { AppLogger } from './logger.service';
import { FrontendErrorController } from './frontend-error.controller';

@Global()
@Module({
  controllers: [FrontendErrorController], // ✅ AQUÍ VA
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
