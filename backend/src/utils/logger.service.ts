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
      // 👉 En Vercel, solo usar consola (no se puede escribir en disco)
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            }),
          ),
        }),
      );
    } else {
      // 👉 En local, escribir logs en archivo
      const logDirectory = path.join(__dirname, '../../logs');

      // Crear carpeta logs si no existe
      if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
      }

      transports.push(
        new winston.transports.DailyRotateFile({
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
            }),
          ),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: 'error',
      transports,
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
