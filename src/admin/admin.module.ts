import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Category } from '../category/entities/category.entitiy';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { Subscription } from '../subscription/entities/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Category, User, Subscription]),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
