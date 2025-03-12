import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://cayro.netlify.app', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://apis.google.com',
          ],
          imgSrc: [
            "'self'",
            'data:',
            'https://example.com',
            'https://cdn.example.com',
          ],
        },
      },
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100, 
      message: 'Demasiadas solicitudes, intenta nuevamente más tarde.',
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 5000;
  app.use(cookieParser());

  await app.listen(port, '0.0.0.0');
}
bootstrap();
