import { Controller, Get, Post } from '@nestjs/common';
import { usersignIndto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { registerdto } from './dto/register.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('/signup')
    async signup(signIndto:usersignIndto){
        return this.authService.signup(signIndto)
    }
    @Post('/signin')
    async signin(registerDto:registerdto){
        return this.authService.login(registerDto)
    }
}
