import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["https://cayro.netlify.app","http://localhost:5173","http://localhost","https://cayro-uniformes.com:8080","https://cayro-uniformes.com"],
    // origin: ["https://cayro.netlify.app","http://localhost:5173"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 5000;
  app.use(cookieParser());
  await app.listen(port,"0.0.0.0");
}
bootstrap();
