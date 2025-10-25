import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  create(@Body() createExamDto: CreateExamDto, @User() user: IUser) {
    return this.examsService.create(createExamDto, user);
  }

  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto, @User() user: IUser) {
    return this.examsService.update(id, updateExamDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.examsService.remove(id, user);
  }
}
