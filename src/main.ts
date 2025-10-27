import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

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
  app.use(cookieParser());
   // Swagger Configuration
  // const config = new DocumentBuilder()
  //   .setTitle('Exam Online API')
  //   .setDescription('API documentation for Exam Online project')
  //   .setVersion('1.0')
  //   .addBearerAuth() // hỗ trợ nhập token JWT
  //   .build();
  //   // 👇 bật deep scan route metadata
  // const document = SwaggerModule.createDocument(app, config, {
  //   deepScanRoutes: true,
  // });
  // SwaggerModule.setup('api/docs', app, document, {
  //   swaggerOptions: { persistAuthorization: true }, // giữ token khi refresh
  // });
   //config swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Series APIs Document')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }
  );


  // Chạy server
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') || 3000);
  console.log(`🚀 Server running at: http://localhost:${configService.get('PORT') || 3000}`);
  console.log(`📘 Swagger docs: http://localhost:${configService.get('PORT') || 3000}/api/docs`);
}
bootstrap();
