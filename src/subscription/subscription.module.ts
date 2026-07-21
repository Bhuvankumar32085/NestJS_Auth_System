import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { AuthModule } from '../auth/auth.module';
import { User } from '../user/entities/user.entity';
import { Plan } from '../plan/entities/plan.entitiy';
import { PaymentModule } from '../payment/payment.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, User, Plan]),
    AuthModule,
    PaymentModule,
    ConfigModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
