import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorator/customize';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

// @Post('upload')
// @Public()
// @UseInterceptors(FileInterceptor('file'))
// uploadFile(
//   @UploadedFile(
//     new ParseFilePipeBuilder()
//       .addFileTypeValidator({
//         fileType: /^image\/(jpe?g|png|gif)$/i,
//       })
//       .addMaxSizeValidator({
//         maxSize: 1024 * 1024,
//       })
//       .build({
//         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
//       }),
//   )
//   file: Express.Multer.File,
// ) {
//   console.log('📂 File received:', file);
//   console.log('📎 MIME type:', file?.mimetype);

//   return {
//     message: 'File uploaded successfully',
//     filename: file.originalname,
//     mimetype: file.mimetype,
//   };
// }

@Post('upload')
@Public()
@UseInterceptors(FileInterceptor('fileUpload'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
    throw new UnprocessableEntityException('Invalid file type');
  }

  if (file.size > 1024 * 1024) {
    throw new UnprocessableEntityException('File too large');
  }

  return this.filesService.uploadFile(file, 'default');
}

@Post('upload-company-logo')
@Public()
@UseInterceptors(FileInterceptor('fileUpload'))
uploadPPictureLogo(@UploadedFile() file: Express.Multer.File) {
  if (!/^image\/(jpe?g|png|gif)$/i.test(file.mimetype)) {
    throw new UnprocessableEntityException('Invalid file type');
  }

  if (file.size > 1024 * 1024) {
    throw new UnprocessableEntityException('File too large');
  }

  return this.filesService.uploadExamLogo(file);
}


  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
