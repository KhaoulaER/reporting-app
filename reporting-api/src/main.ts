import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getConnection } from 'typeorm';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Configurer le serveur pour servir des fichiers statiques
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
    setHeaders: (res, path, stat) => {
      const allowedOrigins = [,'http://localhost:4200']; // Inclure le schéma
      const origin = res.req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
      }
    }
  });

  app.setGlobalPrefix('api', { exclude: [] });
  // Configurer CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Autoriser uniquement ce domaine
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
