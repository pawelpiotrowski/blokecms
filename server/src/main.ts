import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { appConfig } from './app.config';
import { DotEnvVar } from './app.config.interface';
import { AppModule } from './app.module';

void (async function bootstrap() {
  const { isProd, http, hasEnvVars } = appConfig();

  if (!hasEnvVars) {
    Logger.error('env variables are missing!');

    if (isProd) {
      return;
    }
  }

  const app = await NestFactory.create(AppModule, {
    ...(isProd && { logger: ['error', 'warn'] }),
  });

  app.use(cookieParser(process.env[DotEnvVar.authCookieSignSecret]));
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProd,
    }),
  );
  await app.listen(http.port);

  Logger.log(`🚀 nestcms is running on: http://localhost:${http.port}`);
  if (!hasEnvVars) {
    Logger.warn(
      'Looks like you forgot to create ".env" file or provide equivalent via `process.env`',
    );
    Logger.warn('You can generate ".env" with `npm run build:server:dotenv`');
  }
})();
