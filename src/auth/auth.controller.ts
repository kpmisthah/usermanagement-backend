import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { usersignIndto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { registerdto } from './dto/register.dto';
import { LocalGuard } from 'src/guard/local.guard';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('/signup')
    async signup(@Body()signIndto:usersignIndto){
        return await this.authService.signup(signIndto)
    }
    
    @Post('/signin')
    @UseGuards(LocalGuard)
    async signin(@Body()registerDto:registerdto, @Res() res:Response){
       let val =  await this.authService.login(registerDto,res)
       return res.status(200).json(val);
    }

    @Post('/logout')
    async logout(@Res() res: Response) {
      res.cookie('auth_token', '', {
        httpOnly: true,
        expires: new Date(0), 
      });
      
      return res.status(200).json({ message: 'Logged out successfully' });
    }
}
