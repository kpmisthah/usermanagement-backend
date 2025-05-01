import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtGuard } from 'src/guard/jwt.guard';
import { AdminGuard } from 'src/guard/admin.guard';


@Module({
  imports:[AuthModule],
  controllers: [AdminController],
  providers: [AdminService,PrismaService,JwtGuard,AdminGuard]
})
export class AdminModule {}