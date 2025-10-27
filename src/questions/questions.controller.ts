import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ResponseMessage("Tạo câu hỏi thành công")
  create(@Body() createQuestionDto: CreateQuestionDto, @User() user: IUser) {
    return this.questionsService.create(createQuestionDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("Lấy danh sách câu hỏi thành công")
  findAll(@Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string) {
    return this.questionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage("Lấy chi tiết câu hỏi thành công")
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Cập nhật câu hỏi thành công")
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto, @User() user: IUser) {
    return this.questionsService.update(id, updateQuestionDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Xóa câu hỏi thành công")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.questionsService.remove(id, user);
  }
}
