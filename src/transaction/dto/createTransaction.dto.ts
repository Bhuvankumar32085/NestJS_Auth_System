import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

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
  amount!: number;

  @IsEnum(TransactionType, {
    message: 'Type must be either INCOME or EXPENSE',
  })
  type!: TransactionType;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsDateString(
    {},
    {
      message: 'Date must be a valid date',
    },
  )
  date!: Date;

  @IsUUID('4', {
    message: 'Category Id must be a valid UUID',
  })
  categoryId!: string;
}
