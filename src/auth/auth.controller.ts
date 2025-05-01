import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { usersignIndto } from './dto/signIn.dto';
import { AuthService } from './auth.service';
import { registerdto } from './dto/register.dto';
import { LocalGuard } from 'src/guard/local.guard';
import { Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() signUpDto: usersignIndto, @Res({ passthrough: true }) res: Response) {
    console.log('Signup payload:', signUpDto);
    const { access_token, refresh_token, user } = await this.authService.signup(signUpDto);
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return { access_token, user };
  }
    
    @Post('/signin')
    // @UseGuards(LocalGuard)
    async signin(@Body()registerDto:registerdto, @Res({passthrough:true}) res:Response){
      const { access_token, refresh_token, user } = await this.authService.login(registerDto);
      res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      return {access_token,user}
    }

    @Post('/logout')
    async logout(@Res({passthrough:true}) res: Response) {
      res.cookie('refreshToken', '', { maxAge: 0 });
      return { message: 'Logged out successfully' };
    }
    
    @Get('/me')
    @UseGuards(LocalGuard)
  async getCurrentUser(@Req() req,@Res() res:Response) {
    const userId = req.user.id;
    const user = await this.authService.getCurrentUser(Number(userId))
    return res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    
  }

  @Get('/refresh')
  async refresh(@Req() req, @Res({passthrough:true}) res) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    const { access_token, refresh_token, user } = await this.authService.refreshToken(refreshToken);
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
    return {access_token,user}
  }
}
