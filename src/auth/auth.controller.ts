import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { usersignIndto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { registerdto } from './dto/register.dto';
import { LocalGuard } from 'src/guard/local.guard';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('/signup')
    async signup(@Body()signIndto:usersignIndto){
        return this.authService.signup(signIndto)
    }
    @UseGuards(LocalGuard)
    @Post('/signin')
    async signin(@Body()registerDto:registerdto){
        return this.authService.login(registerDto)
    }
}
