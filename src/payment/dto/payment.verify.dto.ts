import { IsString, IsUUID } from 'class-validator';

export class VerifyPaymentDto {
  @IsUUID()
  subscriptionId!: string;

  @IsString()
  razorpay_order_id!: string;

  @IsString()
  razorpay_payment_id!: string;

  @IsString()
  razorpay_signature!: string;
}
