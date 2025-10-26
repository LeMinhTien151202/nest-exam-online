import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './schemas/exam.schema';
import { FilesModule } from 'src/files/files.module';

@Module({
   imports: [MongooseModule.forFeature([{name: Exam.name,schema: ExamSchema,},]),
  FilesModule
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
