import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
// We need to configure our AuthModule to use the Passport features we just defined. Update auth.module.ts to look like this:
@Module({
  imports:[UserModule,PassportModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions:{expiresIn:'15m'}
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports:[AuthService,JwtModule]
})
export class AuthModule {}
//Now, we update our AuthModule to import the UsersModule.