import { Injectable, UnsupportedMediaTypeException } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as fs from 'fs';
import { diskStorage } from "multer";
import * as path from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  getRootPath = () => process.cwd();

  ensureExists(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        console.log("Directory successfully created, or it already exists.");
        return;
      }
      console.error(error);
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const folder = (req?.headers?.folder_type as string) ?? "default";
          const uploadPath = path.join(this.getRootPath(), `public/images/${folder}`);
          this.ensureExists(uploadPath);
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const extName = path.extname(file.originalname);
          const baseName = path.basename(file.originalname, extName);
          const finalName = `${baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),

      /** ✅ Chặn file sai định dạng ngay từ đầu */
      fileFilter: (req, file, cb) => {
        const allowedTypes = /^image\/(jpe?g|png|gif)$/i;

        if (!allowedTypes.test(file.mimetype)) {
          // ❌ Không cho lưu, báo lỗi
          return cb(
            new UnsupportedMediaTypeException(
              `Invalid file type ${file.mimetype}. Only jpeg, jpg, png, gif allowed.`,
            ),
            false,
          );
        }

        // ✅ Cho phép lưu
        cb(null, true);
      },
      limits: {
        fileSize: 1 * 1024 * 1024, // 1MB
      },
    };
  }
}
