import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt,Strategy} from 'passport-jwt'
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }
    async validate(payload:any){
        return {userId:payload.sub,username:payload.username,role:payload.role}
    }
}
// We extract the JWT from the Authorization header.
// We use the same secret to verify the token that was used to sign it.
// The validate() method returns the payload of the valid token. We can access properties like payload.sub in our request handler