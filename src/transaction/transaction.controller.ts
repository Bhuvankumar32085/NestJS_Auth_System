import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../auth/jwt-auth.guard';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { TransactionService } from './transaction.service';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';
import { SubscriptionGuard } from '../subscription/guards/subscription.guard';
import type { Response } from 'express';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createTransaction(
    @Body() dto: CreateTransactionDto,
    @Request() req: AuthRequest,
  ) {
    return await this.transactionService.createTransaction(
      dto,
      req.user.id as string,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getTransactions(@Request() req: AuthRequest) {
    return this.transactionService.getTransactions(req.user.id as string);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateTransaction(
    @Param('id') transactionId: string,
    @Body() dto: UpdateTransactionDto,
    @Request() req: AuthRequest,
  ) {
    return this.transactionService.updateTransaction(
      transactionId,
      dto,
      req.user.id as string,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTransaction(
    @Param('id') transactionId: string,
    @Request() req: AuthRequest,
  ) {
    return this.transactionService.deleteTransaction(
      transactionId,
      req.user.id as string,
    );
  }

  @Get('export')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  exportTransactions(
    @Req() req: AuthRequest,
    @Res() res: Response,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.transactionService.exportTransactions(
      req.user.id,
      res,
      month,
      year,
    );
  }
}
