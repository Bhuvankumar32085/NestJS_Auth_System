import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Category } from '../category/entities/category.entitiy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category]), JwtModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
