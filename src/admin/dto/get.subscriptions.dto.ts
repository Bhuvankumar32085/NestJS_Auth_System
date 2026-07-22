import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import {
  PaymentStatus,
  SubscriptionStatus,
} from '../../subscription/entities/subscription.entity';

export class GetSubscriptionsDto {
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  limit = 10;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: SubscriptionStatus;

  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsOptional()
  sortBy = 'createdAt';

  @IsOptional()
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}
