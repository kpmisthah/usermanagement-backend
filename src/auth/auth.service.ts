import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { usersignIndto } from './dto/signIn.dto';
import * as argon2 from "argon2";
import { registerdto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';
import { jwtConstants } from './constants';
@Injectable()
// Our AuthService has the job of retrieving a user and verifying the password.
//  We create a validateUser() method for this purpose. In the code below, 
export class AuthService {
    constructor(private jwtService:JwtService,private prisma:PrismaService){}

    async validateUser(username:string,pass:string):Promise<any>{
        const user = await this.prisma.user.findFirst({
            where:{username:username}
        })
        if(!user || !(await argon2.verify(user.password,pass))){
            throw new UnauthorizedException("invalid credentials")
        }
        if(user && await argon2.verify(user.password,pass)){
            const{password,...result} = user
        return result
    }
    return null
}

async signup(userData: usersignIndto) {
  console.log('Signup data:', userData);
  const existingUser = await this.prisma.user.findFirst({
    where: { email: userData.email },
  });
  if (existingUser) {
    console.log('User already exists with email:', userData.email);
    throw new BadRequestException('User already exists');
  }
  const hash = await argon2.hash(userData.password);
  const user = await this.prisma.user.create({
    data: {
      username: userData.username,
      password: hash,
      email: userData.email,
      role: 'user', // Default role
    },
  });
  console.log('User created:', user);

  const payload = { sub: user.id, username: user.username, role: user.role };
  const accessToken = this.jwtService.sign(payload, {
    secret: jwtConstants.secret,
    expiresIn: '15m',
  });
  const refreshToken = this.jwtService.sign(payload, {
    secret: jwtConstants.refresh_secret,
    expiresIn: '30d',
  });
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: { id: user.id, username: user.username, email: user.email, role: user.role, profilePic: user.profilePic },
  };
}
async login(register:registerdto){
    let user =await this.prisma.user.findFirst({where:{username:register.username}})
    if(!user){
        throw new Error("Invalid credentials")
    }
    const isPasswordValid = await argon2.verify(user.password,register.password)
    if(!isPasswordValid){
        throw new HttpException('invalid credentials',HttpStatus.UNAUTHORIZED)
    }
    const payload = {username:user.username,sub:user.id,role:user.role}
   const access_token = this.jwtService.sign(payload,{
    secret:jwtConstants.secret,
    expiresIn:'15m'
   })

   const refresh_token = this.jwtService.sign(payload,{
    secret:jwtConstants.refresh_secret,
    expiresIn:'30d'
   })
   return {
    access_token:access_token,
    refresh_token:refresh_token,
    user
   }
}
async getCurrentUser(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _, ...result } = user;
    return result;
  }
  
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:jwtConstants.refresh_secret
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const newPayload = { sub: user.id, username: user.username, role: user.role };
      const accessToken = this.jwtService.sign(newPayload, {
        secret: jwtConstants.secret,
        expiresIn: '15m',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: jwtConstants.refresh_secret,
        expiresIn: '30d',
      });
      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        user: { id: user.id, username: user.username, email: user.email, role: user.role, profilePic: user.profilePic },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
