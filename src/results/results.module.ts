import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './schemas/result.schema';

@Module({
  imports: [MongooseModule.forFeature([
        {
          name: Result.name,
          schema: ResultSchema,
        },
      ]),],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
