import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { profile } from 'console';

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService){}
  async updateProfile(id:number,updateProfileDto:UpdateProfileDto){
    return await this.prisma.user.update({
      where:{id},
      data:{
        ...updateProfileDto,
        profilePic:updateProfileDto.profilePic
      }
    })
  }


}

