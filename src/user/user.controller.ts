import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
    const userId = req.user?.userId ?? req.user?.sub; 
    if (!userId || isNaN(Number(userId))) {
      throw new HttpException('Invalid or missing user ID', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.getProfile(Number(userId));
  }

 
  @Put('/update')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfile(
    @Req() req, @Res({passthrough:true}) res:Response,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = req.user?.userId ?? req.user?.sub; 
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
