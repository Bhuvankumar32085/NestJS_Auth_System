import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Transaction,
  TransactionType,
} from '../transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entitiy';

interface TotalIncomeResult {
  totalIncome: string;
}

interface TotalExpenseResult {
  totalExpense: string;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getSummary(userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      const incomeResult = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('COALESCE(SUM(transaction.amount), 0)', 'totalIncome')
        .where('transaction.userId = :userId', { userId })
        .andWhere('transaction.type = :type', {
          type: TransactionType.INCOME,
        })
        .getRawOne<TotalIncomeResult>();

      const expenseResult = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('COALESCE(SUM(transaction.amount), 0)', 'totalExpense')
        .where('transaction.userId = :userId', { userId })
        .andWhere('transaction.type = :type', {
          type: TransactionType.EXPENSE,
        })
        .getRawOne<TotalExpenseResult>();

      const totalTransactions = await this.transactionRepository.count({
        where: {
          user: {
            id: userId,
          },
        },
      });

      const totalIncome = Number(incomeResult?.totalIncome);
      const totalExpense = Number(expenseResult?.totalExpense);
      const balance = totalIncome - totalExpense;

      return {
        success: true,
        message: 'Dashboard summary fetched successfully',
        data: {
          totalIncome,
          totalExpense,
          balance,
          totalTransactions,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }

  async getMonthlySummary(userId: string, year: number) {
    try {
      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      const result = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('EXTRACT(MONTH FROM transaction.date)', 'month')
        .addSelect(
          `SUM(
          CASE
            WHEN transaction.type = 'INCOME'
            THEN transaction.amount
            ELSE 0
          END
        )`,
          'income',
        )
        .addSelect(
          `SUM(
          CASE
            WHEN transaction.type = 'EXPENSE'
            THEN transaction.amount
            ELSE 0
          END
        )`,
          'expense',
        )
        .where('transaction.userId = :userId', { userId })
        .andWhere('EXTRACT(YEAR FROM transaction.date) = :year', { year })
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany();

      return {
        success: true,
        message: 'Monthly summary fetched successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }

  async getDailySummary(userId: string, month: number, year: number) {
    try {
      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      const result = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select('EXTRACT(DAY FROM transaction.date)', 'day')
        .addSelect(
          `
        SUM(
          CASE
            WHEN transaction.type = 'INCOME'
            THEN transaction.amount
            ELSE 0
          END
        )
        `,
          'income',
        )
        .addSelect(
          `
        SUM(
          CASE
            WHEN transaction.type = 'EXPENSE'
            THEN transaction.amount
            ELSE 0
          END
        )
        `,
          'expense',
        )
        .where('transaction.userId = :userId', { userId })
        .andWhere('EXTRACT(MONTH FROM transaction.date) = :month', {
          month,
        })
        .andWhere('EXTRACT(YEAR FROM transaction.date) = :year', {
          year,
        })
        .groupBy('day')
        .orderBy('day', 'ASC')
        .getRawMany();

      return {
        success: true,
        message: 'Daily summary fetched successfully',
        data: result,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }
}
