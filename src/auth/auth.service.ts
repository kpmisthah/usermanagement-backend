import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { usersignIndto } from './dto/signIn.dto';
import * as argon2 from "argon2";
import { PrismaClient } from '@prisma/client';
import { registerdto } from './dto/register.dto';
@Injectable()
// Our AuthService has the job of retrieving a user and verifying the password.
//  We create a validateUser() method for this purpose. In the code below, 
export class AuthService {
    constructor(private jwtService:JwtService,private prisma:PrismaClient){}

    async validateUser(username:string,pass:string):Promise<any>{
        const user = await this.prisma.user.findUnique(username)
        if(user && await argon2.verify(user.password,pass)){
            const{password,...result} = user
        return result
    }
    return null
}

async signup(userData:usersignIndto){
    let hash = await argon2.hash(userData.password)
    
    let newUser = await this.prisma.user.create({
        data:{
            username:userData.username,
            password:hash,
            email:userData.email
        }
    })
    return newUser
}
async login(register:registerdto){
    let user = this.prisma.user.findUnique(register.username)
    if(!user){
        throw new Error("Invalid credentials")
    }
    const isPasswordValid = await argon2.verify(user.password,register.password)
    if(!isPasswordValid){
        throw new HttpException('invalid credentials',HttpStatus.UNAUTHORIZED)
    }
    const payload = {username:user.username,sub:user.id}
    return{
        access_token:this.jwtService.sign(payload)
    }
}
}
