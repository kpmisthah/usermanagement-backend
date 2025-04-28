import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [AuthModule, UserModule,  AdminModule, PrismaModule,ConfigModule.forRoot({isGlobal:true}), FileUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
