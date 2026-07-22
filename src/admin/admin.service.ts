import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entitiy';
import { User } from '../user/entities/user.entity';
import {
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
} from '../subscription/entities/subscription.entity';
import { GetSubscriptionsDto } from './dto/get.subscriptions.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,

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

  async getSubscriptionStats() {
    const [
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      pendingSubscriptions,
      cancelledSubscriptions,
      successfulPayments,
      failedPayments,
      pendingPayments,
    ] = await Promise.all([
      this.subscriptionRepository.count(),

      this.subscriptionRepository.count({
        where: {
          status: SubscriptionStatus.ACTIVE,
        },
      }),

      this.subscriptionRepository.count({
        where: {
          status: SubscriptionStatus.EXPIRED,
        },
      }),

      this.subscriptionRepository.count({
        where: {
          status: SubscriptionStatus.PENDING,
        },
      }),

      this.subscriptionRepository.count({
        where: {
          status: SubscriptionStatus.CANCELLED,
        },
      }),

      this.subscriptionRepository.count({
        where: {
          paymentStatus: PaymentStatus.SUCCESS,
        },
      }),

      this.subscriptionRepository.count({
        where: {
          paymentStatus: PaymentStatus.FAILED,
        },
      }),

      this.subscriptionRepository.count({
        where: {
          paymentStatus: PaymentStatus.PENDING,
        },
      }),
    ]);

    return {
      totalSubscriptions,

      subscriptions: {
        active: activeSubscriptions,
        expired: expiredSubscriptions,
        pending: pendingSubscriptions,
        cancelled: cancelledSubscriptions,
      },

      payments: {
        success: successfulPayments,
        failed: failedPayments,
        pending: pendingPayments,
      },
    };
  }

  async getAllSubscriptions(query: GetSubscriptionsDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        paymentStatus,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
      } = query;

      const qb = this.subscriptionRepository
        .createQueryBuilder('subscription')
        .leftJoinAndSelect('subscription.user', 'user')
        .leftJoinAndSelect('subscription.plan', 'plan');

      if (search) {
        qb.andWhere(
          `
          (
            user.fName ILIKE :search
            OR user.lName ILIKE :search
            OR user.email ILIKE :search
            OR plan.name ILIKE :search
          )
          `,
          {
            search: `%${search}%`,
          },
        );
      }

      if (status) {
        qb.andWhere('subscription.status = :status', { status });
      }

      if (paymentStatus) {
        qb.andWhere('subscription.paymentStatus = :paymentStatus', {
          paymentStatus,
        });
      }

      const allowedSortFields = [
        'createdAt',
        'startDate',
        'endDate',
        'status',
        'paymentStatus',
      ];

      const orderBy = allowedSortFields.includes(sortBy)
        ? `subscription.${sortBy}`
        : 'subscription.createdAt';

      qb.orderBy(orderBy, sortOrder);
      qb.skip((page - 1) * limit);
      qb.take(limit);
      const [subscriptions, total] = await qb.getManyAndCount();
      return {
        success: true,
        message: 'Subscriptions fetched successfully.',
        data: subscriptions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to fetch subscriptions.',
      );
    }
  }
}
