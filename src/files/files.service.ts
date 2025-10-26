import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { join } from 'path';

@Injectable()
export class FilesService {
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  /**
   * Xử lý upload file và trả về đường dẫn
   * @param file - File đã upload
   * @param folderType - Loại folder (company, user, default)
   * @returns Object chứa đường dẫn file
   */
  uploadFile(file: Express.Multer.File, folderType = 'default') {
    if (!file) {
      throw new Error('No file uploaded');
    }

    // Tạo đường dẫn file từ folder và filename
    const filePath = `/images/${folderType}/${file.filename}`;
    
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: filePath,
      fullPath: join(process.cwd(), 'public', filePath)
    };
  }

  /**
   * Upload logo cho company
   * @param file - File logo
   * @returns Object chứa đường dẫn logo
   */
  uploadExamLogo(file: Express.Multer.File) {
    return this.uploadFile(file, 'exam');
  }
}
