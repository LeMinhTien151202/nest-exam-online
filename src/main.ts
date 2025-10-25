import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );  
  const reflector = app.get('Reflector');
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
   // Bật versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // Version mặc định
    prefix: 'api/v', // Prefix cho version
  });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();
