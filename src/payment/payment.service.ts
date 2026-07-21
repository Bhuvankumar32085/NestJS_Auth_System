import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Razorpay from 'razorpay';
import {
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
} from '../subscription/entities/subscription.entity';
import { Repository } from 'typeorm';
import { VerifyPaymentDto } from './dto/payment.verify.dto';
import * as crypto from 'crypto';

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
      };
    };
  };
}

@Injectable()
export class PaymentService {
  private readonly razorpay: Razorpay;

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID')!,
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
    });
  }

  async createOrder(amount: number) {
    const options = {
      amount: Math.round(amount * 100), // ₹199 -> 19900 paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await this.razorpay.orders.create(options);

    return order;
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        id: verifyPaymentDto.subscriptionId,
      },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new NotFoundException({
        success: false,
        message: 'Subscription not found.',
        data: null,
      });
    }

    // Order ID Match
    if (subscription.razorpayOrderId !== verifyPaymentDto.razorpay_order_id) {
      throw new BadRequestException({
        success: false,
        message: 'Invalid Order ID.',
        data: null,
      });
    }

    // Signature Verify
    const body = `${verifyPaymentDto.razorpay_order_id}|${verifyPaymentDto.razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        this.configService.get<string>('RAZORPAY_KEY_SECRET')!,
      )
      .update(body)
      .digest('hex');

    if (expectedSignature !== verifyPaymentDto.razorpay_signature) {
      subscription.paymentStatus = PaymentStatus.FAILED;
      subscription.status = SubscriptionStatus.CANCELLED;

      await this.subscriptionRepository.save(subscription);

      throw new BadRequestException({
        success: false,
        message: 'Invalid payment signature.',
        data: null,
      });
    }

    // Payment Success
    subscription.paymentStatus = PaymentStatus.SUCCESS;
    subscription.status = SubscriptionStatus.ACTIVE;

    subscription.razorpayPaymentId = verifyPaymentDto.razorpay_payment_id;

    const startDate = new Date();

    subscription.startDate = startDate;

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + subscription.plan.duration);

    subscription.endDate = endDate;

    await this.subscriptionRepository.save(subscription);

    return {
      success: true,
      message: 'Payment verified successfully.',
      data: {
        subscriptionId: subscription.id,
        paymentId: subscription.razorpayPaymentId,
        orderId: subscription.razorpayOrderId,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      },
    };
  }

  async handleWebhook(rawBody: Buffer, razorpaySignature: string) {
    console.log('__________ webhook hit ___________');
    const generatedSignature = crypto
      .createHmac(
        'sha256',
        this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET')!,
      )
      .update(rawBody)
      .digest('hex');
    if (generatedSignature !== razorpaySignature) {
      throw new BadRequestException('Invalid Webhook Signature');
    }
    const event = JSON.parse(rawBody.toString()) as RazorpayWebhookEvent;
    console.log(event.event);
    if (event.event === 'payment.captured') {
      const orderId = event.payload.payment.entity.order_id;
      const paymentId = event.payload.payment.entity.id;
      const subscription = await this.subscriptionRepository.findOne({
        where: {
          razorpayOrderId: orderId,
        },
        relations: ['plan'],
      });
      if (!subscription) {
        return {
          success: false,
          message: 'Subscription not found.',
        };
      }
      // Duplicate webhook ignore
      if (subscription.status === SubscriptionStatus.ACTIVE) {
        return {
          success: true,
          message: 'Already Processed',
        };
      }

      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.paymentStatus = PaymentStatus.SUCCESS;
      subscription.razorpayPaymentId = paymentId;
      const startDate = new Date();
      subscription.startDate = startDate;
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + subscription.plan.duration);
      subscription.endDate = endDate;
      await this.subscriptionRepository.save(subscription);
      console.log('Subscription Activated');
    }

    return {
      success: true,
    };
  }
}
