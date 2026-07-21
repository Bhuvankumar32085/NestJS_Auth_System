import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../auth/jwt-auth.guard';
import { CreateSubscriptionDto } from './dto/subscription.create.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Req() req: AuthRequest,
  ) {
    return this.subscriptionService.createSubscription(
      req.user.id as string,
      createSubscriptionDto,
    );
  }
}
