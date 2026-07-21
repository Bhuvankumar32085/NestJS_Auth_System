import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthRequest } from '../../auth/jwt-auth.guard';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (!request.user) {
      throw new ForbiddenException('Unauthorized');
    }

    if (request.user.role != 'admin') {
      throw new ForbiddenException('Only admin can access this API');
    }

    return true;
  }
}
