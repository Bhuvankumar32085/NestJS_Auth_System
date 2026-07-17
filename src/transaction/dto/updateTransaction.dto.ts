import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TransactionType } from '../entities/transaction.entity';

export class UpdateTransactionDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'Amount must be a valid number',
    },
  )
  @Min(0.01, {
    message: 'Amount must be greater than 0',
  })
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType, {
    message: 'Type must be either INCOME or EXPENSE',
  })
  type?: TransactionType;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Date must be a valid date',
    },
  )
  date?: Date;

  @IsOptional()
  @IsUUID('4', {
    message: 'Category Id must be a valid UUID',
  })
  categoryId?: string;
}
