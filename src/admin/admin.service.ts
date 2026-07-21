import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entitiy';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllUsers(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;
    const query = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.fName',
        'user.lName',
        'user.email',
        'user.role',
        'user.createdAt',
      ]);
    // Search by First Name, Last Name and Email
    if (search && search.trim() !== '') {
      query.andWhere(
        `(LOWER(user.fName) LIKE LOWER(:search)
        OR LOWER(user.lName) LIKE LOWER(:search)
        OR LOWER(user.email) LIKE LOWER(:search))`,
        {
          search: `%${search.trim()}%`,
        },
      );
    }
    query.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

    const [users, total] = await query.getManyAndCount();

    return {
      success: true,
      message: 'Users fetched successfully',
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findAllTransactions(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.user', 'user')
      .leftJoin('transaction.category', 'category')
      .select([
        'transaction.id',
        'transaction.title',
        'transaction.amount',
        'transaction.type',
        'transaction.description',
        'transaction.date',
        'transaction.createdAt',
        'user.id',
        'user.fName',
        'user.lName',
        'user.email',
        'category.id',
        'category.name',
        'category.type',
      ])
      .orderBy('transaction.createdAt', 'DESC')
      .skip(skip)
      .take(limit);
    const [transactions, total] = await query.getManyAndCount();
    return {
      success: true,
      message: 'Transactions fetched successfully',
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findTransactionsByUser(userId: string, paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.user', 'user')
      .leftJoin('transaction.category', 'category')
      .select([
        'transaction.id',
        'transaction.title',
        'transaction.amount',
        'transaction.type',
        'transaction.description',
        'transaction.date',
        'transaction.createdAt',
        'user.id',
        'user.fName',
        'user.lName',
        'user.email',
        'category.id',
        'category.name',
        'category.type',
      ])
      .where('user.id = :userId', { userId })
      .orderBy('transaction.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [transactions, total] = await query.getManyAndCount();

    return {
      success: true,
      message: 'User transactions fetched successfully',
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }
}
