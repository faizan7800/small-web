import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // The Next.js app runs on another port, so the browser needs permission to call this API.
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000' });
  // Reject bodies with missing, wrong-typed or unknown fields before they reach any service.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();
