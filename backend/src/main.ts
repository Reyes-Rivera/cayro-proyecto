import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://alexa.amazon.com',
        'https://developer.amazon.com',
        'https://cayro.netlify.app',
        'http://10.0.2.2:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
      },
    }),
  );

  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000,
  //     max: 100,
  //     message: 'Demasiadas solicitudes, intenta nuevamente más tarde.',
  //   }),
  // );
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 5000;
  app.use(cookieParser());

  await app.listen(port, '0.0.0.0');
}
bootstrap();
