import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const logDirectory = path.join(__dirname, '../../logs');

    const transport = new winston.transports.DailyRotateFile({
      filename: `${logDirectory}/error-%DATE%.log`, 
      datePattern: 'YYYY-WW',
      zippedArchive: false, 
      maxSize: '20m',
      maxFiles: '4w', 
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
      ),
    });

    this.logger = winston.createLogger({
      level: 'error',
      transports: [transport],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} ${trace ? `\nTrace: ${trace}` : ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
