import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Category } from '../category/entities/category.entitiy';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';
import { Response } from 'express';
import { Parser } from 'json2csv';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createTransaction(dto: CreateTransactionDto, userId: string) {
    try {
      const { title, amount, type, description, date, categoryId } = dto;

      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      const category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
          user: {
            id: userId,
          },
        },
      });

      if (!category) {
        throw new NotFoundException({
          success: false,
          message: 'Category not found',
          data: null,
        });
      }

      if (category.type.toString() !== type.toString()) {
        throw new BadRequestException({
          success: false,
          message: 'Transaction type must match category type',
          data: null,
        });
      }

      const transaction = this.transactionRepository.create({
        title: title.trim(),
        amount,
        type,
        description: description?.trim(),
        date,
        user: {
          id: userId,
        },
        category: {
          id: categoryId,
        },
      });

      const savedTransaction =
        await this.transactionRepository.save(transaction);

      return {
        success: true,
        message: 'Transaction created successfully',
        data: savedTransaction,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException({
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }

  async getTransactions(userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      const transactions = await this.transactionRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
        relations: {
          category: true,
        },
        order: {
          date: 'DESC',
          createdAt: 'DESC',
        },
      });

      return {
        success: true,
        message: 'Transactions fetched successfully',
        data: transactions,
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

  async updateTransaction(
    transactionId: string,
    dto: UpdateTransactionDto,
    userId: string,
  ) {
    try {
      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      const transaction = await this.transactionRepository.findOne({
        where: {
          id: transactionId,
          user: {
            id: userId,
          },
        },
        relations: {
          category: true,
        },
      });

      if (!transaction) {
        throw new NotFoundException({
          success: false,
          message: 'Transaction not found',
          data: null,
        });
      }

      if (dto.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: {
            id: dto.categoryId,
            user: {
              id: userId,
            },
          },
        });

        if (!category) {
          throw new NotFoundException({
            success: false,
            message: 'Category not found',
            data: null,
          });
        }

        const transactionType = dto.type ?? transaction.type;

        if (`${category.type}` !== `${transactionType}`) {
          throw new BadRequestException({
            success: false,
            message: 'Transaction type must match category type',
            data: null,
          });
        }

        transaction.category = category;
      }

      transaction.title = dto.title?.trim() ?? transaction.title;
      transaction.amount = dto.amount ?? transaction.amount;
      transaction.type = dto.type ?? transaction.type;
      transaction.description =
        dto.description?.trim() ?? transaction.description;
      transaction.date = dto.date ?? transaction.date;

      const updatedTransaction =
        await this.transactionRepository.save(transaction);

      return {
        success: true,
        message: 'Transaction updated successfully',
        data: updatedTransaction,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }

  async deleteTransaction(transactionId: string, userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      const transaction = await this.transactionRepository.findOne({
        where: {
          id: transactionId,
          user: {
            id: userId,
          },
        },
      });

      if (!transaction) {
        throw new NotFoundException({
          success: false,
          message: 'Transaction not found',
          data: null,
        });
      }

      await this.transactionRepository.remove(transaction);

      return {
        success: true,
        message: 'Transaction deleted successfully',
        data: null,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid Transaction Id',
          data: null,
        });
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }

  async exportTransactions(
    userId: string,
    res: Response,
    month?: number,
    year?: number,
  ): Promise<void> {
    try {
      const qb = this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.category', 'category')
        .leftJoin('transaction.user', 'user')
        .where('user.id = :userId', { userId });

      // Filter by month & year (optional)
      if (month && year) {
        qb.andWhere('EXTRACT(MONTH FROM transaction.date) = :month', {
          month,
        }).andWhere('EXTRACT(YEAR FROM transaction.date) = :year', {
          year,
        });
      }

      qb.orderBy('transaction.date', 'DESC');

      const transactions = await qb.getMany();

      if (!transactions.length) {
        throw new NotFoundException(
          'No transactions found for the selected period.',
        );
      }

      // Calculate summary
      const totalIncome = transactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpense = transactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const netSavings = totalIncome - totalExpense;

      // Transaction rows
      const transactionRows = transactions.map((transaction, index) => ({
        'Sr No': index + 1,
        Title: transaction.title,
        Category: transaction.category.name,
        Type: transaction.type,
        Amount: Number(transaction.amount),
        Description: transaction.description ?? '',
        Date: new Date(transaction.date).toLocaleDateString('en-GB'),
      }));

      // CSV content
      const parser = new Parser();
      const transactionCsv = parser.parse(transactionRows);

      const csv = `Expense Tracker Report
         Month,${month && year ? `${month}/${year}` : 'All Records'}
         Total Income,${totalIncome.toFixed(2)}
         Total Expense,${totalExpense.toFixed(2)}
         Net Savings,${netSavings.toFixed(2)}
         
         Transactions
         
         ${transactionCsv}`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="transactions.csv"',
      );

      res.status(200).send(csv);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to export transactions.');
    }
  }
}
