import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileUploadService } from 'src/file-upload/file-upload.service';
@Module({
  imports:[PrismaModule],
  controllers: [UserController],
  providers: [UserService,FileUploadService],
  exports:[UserService]
})
export class UserModule {}
