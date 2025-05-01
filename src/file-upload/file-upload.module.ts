import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express'; //MulterModule to specify the upload destination and how it should name the file.
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const uploadDir = path.join(process.cwd(), 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports:[FileUploadService]
})
export class FileUploadModule {}
