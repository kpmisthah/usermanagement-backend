import { Body, Controller, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService,
        private readonly fileUploadService:FileUploadService
    ){}
    @Put('update/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateUserProfile(@Param('id') id:number,@Body() updateProfileDto:UpdateProfileDto,@UploadedFile() file:Express.Multer.File){
        if(file){
            const fileUploadResult = this.fileUploadService.handleFileUpload(file)
            updateProfileDto.profilePic = fileUploadResult.filePath
        }
        return this.userService.updateProfile(id,updateProfileDto)
    }
}
