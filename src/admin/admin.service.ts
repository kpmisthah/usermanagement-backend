import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateuserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class AdminService {
    constructor(private prisma:PrismaService){}
    async viewUsers(){
        return await this.prisma.user.findMany({
            where:{role:'user'}
        })
    }

    async create(createUser:CreateuserDto){
        let newUser = await this.prisma.user.create({
            data:{
                username:createUser.username,
                password:createUser.password,
                email:createUser.email
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
