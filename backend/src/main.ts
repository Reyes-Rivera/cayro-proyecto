import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://darkred-vulture-762056.hostingersite.com', 'http://localhost:5173',"https://39a8-2806-10a6-14-3fa2-357b-b384-15e1-73e9.ngrok-free.app","https://fvxgnkp2-5173.usw3.devtunnels.ms"],
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
          ],
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
