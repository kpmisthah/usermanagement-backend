// src/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['auth_token']; 

    if (!token) {
      return false; 
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Attach the user to the request object
      return true;
    } catch (error) {
      return false; 
    }
  }
}
