import { Module,forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtGuard } from 'src/guard/jwt.guard';

@Module({
  imports:[PrismaModule,forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService,FileUploadService,JwtGuard],
  exports:[UserService]
})
export class UserModule {}