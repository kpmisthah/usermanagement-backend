import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService,
        private readonly fileUploadService:FileUploadService
    ){}
    @Get()
    @UseGuards(JwtGuard)
  async getProfile(@Req() req) {
    console.log('getProfile req.user:', req.user);
    const userId = req.user?.userId ?? req.user?.sub; // Temporary fallback
    console.log('getProfile userId:', userId);
    if (!userId || isNaN(Number(userId))) {
      throw new HttpException('Invalid or missing user ID', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.getProfile(Number(userId));
  }

  @UseGuards(JwtGuard)
  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfile(
    @Req() req,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log('updateUserProfile req.user:', req.user);
    const userId = req.user?.userId ?? req.user?.sub; 
    console.log('updateUserProfile userId:', userId);
    if (!userId || isNaN(Number(userId))) {
      throw new HttpException('Invalid or missing user ID', HttpStatus.UNAUTHORIZED);
    }

    if (file) {
      const fileUploadResult = this.fileUploadService.handleFileUpload(file);
      console.log('fileUploadResult.base64:', fileUploadResult.base64);
      updateProfileDto.profilePic = fileUploadResult.base64;
    }

    return this.userService.updateProfile(Number(userId), updateProfileDto);
  }
}
