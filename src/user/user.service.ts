import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';


@Injectable()
export class UserService {
  constructor(private prisma:PrismaService){}
  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    if (!id || isNaN(id)) {
      throw new Error('Invalid or missing user ID');
    }
  
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...updateProfileDto,
          profilePic: updateProfileDto.profilePic,
        },
      });
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  async getProfile(id:number){
    const user = await this.prisma.user.findUnique({
      where:{id},
      select:{id:true,username:true,email:true,role:true,profilePic:true}
    })
    if(!user){
      throw new NotFoundException("user not found")
    }
    return user
  }


}

