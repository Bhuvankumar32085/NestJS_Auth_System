import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SubscriptionService } from '../subscription.service';
import { AuthRequest } from '../../auth/jwt-auth.guard';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const userId = request.user.id as string;
    const hasSubscription =
      await this.subscriptionService.hasActiveSubscription(userId);

    if (!hasSubscription) {
      throw new ForbiddenException(
        'Your subscription has expired or is not active.',
      );
    }

    return true;
  }
}
