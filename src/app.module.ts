import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamsModule } from './exams/exams.module';
import { ResultsModule } from './results/results.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
    isGlobal: true,
  }),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    QuestionsModule,
    ExamsModule,
    ResultsModule,
    PermissionsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
