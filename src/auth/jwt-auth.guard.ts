import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        success: false,
        message: 'Token Not Found',
        data: null,
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('payload', payload);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException({
        success: false,
        message: 'Invalid Token',
        data: null,
      });
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    const parts = authHeader?.split(' ');
    const [type, token] = parts ?? [];
    console.log('type', type);
    console.log('token', token);
    return type === 'Bearer' ? token : undefined;
  }
}
