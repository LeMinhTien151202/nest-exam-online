import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './schemas/exam.schema';

@Module({
   imports: [MongooseModule.forFeature([
          {
            name: Exam.name,
            schema: ExamSchema,
          },
        ]),],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
