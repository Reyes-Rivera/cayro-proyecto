import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isVercel = !!process.env.VERCEL;
    const transports: winston.transport[] = [];

    if (isVercel) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );
    } else {
      const logDirectory = path.join(__dirname, '../../logs');

      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }

      transports.push(
        new winston.transports.DailyRotateFile({
          dirname: logDirectory,
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '90d',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );

      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: 'info',
      transports,
    });

  }

  log(message: string | Record<string, any>) {
    if (typeof message === 'string') {
      this.logger.info({ message });
    } else {
      this.logger.info(message);
    }
  }

  warn(message: string | Record<string, any>) {
    if (typeof message === 'string') {
      this.logger.warn({ message });
    } else {
      this.logger.warn(message);
    }
  }

  error(message: string | Record<string, any>, trace?: string) {
    if (typeof message === 'string') {
      this.logger.error({ message, trace });
    } else {
      this.logger.error(message);
    }
  }
}
