import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt,Strategy} from 'passport-jwt'
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { jwtConstants } from "../constants";
import { Request } from "express";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                  const token = request?.cookies?.['auth_token'];
                  console.log('Extracted auth_token from cookie:', token ? 'present' : 'missing');
                  return token;
                },
              ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }
    async validate(payload:any){
        console.log('JWT Payload:', payload);
        if (!payload.sub) {
          console.error('JWT payload missing sub field');
          throw new UnauthorizedException('Invalid JWT payload: missing sub field');
        }
        const result = {
          userId: payload.sub,
          username: payload.username,
          role: payload.role,
        };
        console.log('JwtStrategy validate result:', result);
        return result;
      }
}
// We extract the JWT from the Authorization header.
// We use the same secret to verify the token that was used to sign it.
// The validate() method returns the payload of the valid token. We can access properties like payload.sub in our request handler