import { Controller, Post, Request, UseGuards,Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { LocalGuard } from './guard/local.guard';
import { JwtGuard } from './guard/jwt.guard';

@Controller()
export class AppController {
  constructor(private authService:AuthService){}
  @UseGuards(LocalGuard)
  @Post('auth/login')
  async login(@Request()req){
    return this.authService.login(req.user)
  }
  @Post('auth/logout')
  async logout(@Request()req){
    return req.logout()
  }
  @UseGuards(JwtGuard)
  @Get('profile')
    getProfile(@Request() req){
      return req.user
  }
}
