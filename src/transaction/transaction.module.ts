import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { JwtModule } from '@nestjs/jwt';
import { Category } from '../category/entities/category.entitiy';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Category]),
    JwtModule,
    SubscriptionModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
