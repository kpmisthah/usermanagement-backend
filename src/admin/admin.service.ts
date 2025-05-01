import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateuserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminService {
    constructor(private prisma:PrismaService){}
    async viewUsers(search?: string) {
        console.log('viewUsers search:', search);
        const where = {
          role: 'user',
          ...(search && {
            OR: [
              { username: { contains: search } },
              { email: { contains: search } },
            ],
          }),
        };
    
        const users = await this.prisma.user.findMany({
          where,
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            profilePic: true,
          },
        });
    
        console.log('Found users:', users);
        return users;
      }

    async create(createUser:CreateuserDto){
        let newUser = await this.prisma.user.create({
            data:{
                username:createUser.username,
                password:createUser.password,
                email:createUser.email,
                role:createUser.role
            }
        })
        return newUser
    }

    async updateUser(id:number,updateUser:UpdateUserDto){
       return await this.prisma.user.update({
        where:{id:Number(id)},
        data:{
            username:updateUser.username,
            password:updateUser.password,
            email:updateUser.email,
            role:updateUser.role,
            profilePic:updateUser.profilePic
        }
        })
    }

    async deleteUser(id:number){
        return await this.prisma.user.delete({
            where:{id:Number(id)}
        })
    }
}
