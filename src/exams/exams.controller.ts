import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UnprocessableEntityException } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService,
    private readonly filesService : FilesService
  ) {}

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

  @Post(':id/upload-picture')
  @ResponseMessage('Upload logo thành công')
  @UseInterceptors(FileInterceptor('fileUpload'))
  async uploadLogo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @User() user: IUser
  ) {
    // Validate file
    if (!file) {
      throw new UnprocessableEntityException('No file uploaded');
    }

    if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
      throw new UnprocessableEntityException('Invalid file type. Only jpeg, jpg, png, gif allowed');
    }

    if (file.size > 1024 * 1024) {
      throw new UnprocessableEntityException('File too large. Maximum size is 1MB');
    }

    // Upload file và lấy đường dẫn
    const uploadResult = this.filesService.uploadExamLogo(file);
    
    // Cập nhật logo trong company
    const updatedCompany = await this.examsService.updateLogo(id, uploadResult.path, user);

    return {
      message: 'Logo uploaded and updated successfully',
      company: updatedCompany,
      file: uploadResult
    };
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
