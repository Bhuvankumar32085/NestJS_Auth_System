import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from '../plan/entities/plan.entitiy';
import { User } from '../user/entities/user.entity';
import {
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/subscription.create.dto';
import { PaymentService } from '../payment/payment.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,

    private readonly paymentService: PaymentService,

    private readonly configService: ConfigService,
  ) {}

  async createSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
    // 1. Find User
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'User not found.',
        data: null,
      });
    }

    // 2. Find Plan
    const plan = await this.planRepository.findOne({
      where: {
        id: createSubscriptionDto.planId,
      },
    });

    if (!plan) {
      throw new NotFoundException({
        success: false,
        message: 'Plan not found.',
        data: null,
      });
    }

    // 3. Check Plan Active
    if (!plan.isActive) {
      throw new BadRequestException({
        success: false,
        message: 'This plan is currently unavailable.',
        data: null,
      });
    }

    // 4. Existing Active Subscription Check
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['user'],
    });

    if (existingSubscription) {
      throw new ConflictException({
        success: false,
        message: 'You already have an active subscription.',
        data: null,
      });
    }

    // 5. Create Razorpay Order
    const order = await this.paymentService.createOrder(plan.price);

    // 6. Create Subscription
    const subscription = this.subscriptionRepository.create({
      user,
      plan,
      paymentStatus: PaymentStatus.PENDING,
      status: SubscriptionStatus.PENDING,
      razorpayOrderId: order.id,
    });

    await this.subscriptionRepository.save(subscription);

    // 7. Return
    return {
      success: true,
      message: 'Subscription created successfully.',
      data: {
        subscriptionId: subscription.id,
        orderId: order.id,
        amount: (order.amount as number) / 100,
        currency: order.currency,
        key: this.configService.get('RAZORPAY_KEY_ID') as string,
      },
    };
  }
}
