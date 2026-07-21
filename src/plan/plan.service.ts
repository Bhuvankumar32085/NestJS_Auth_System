import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entitiy';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/plan.create.dto';
import { PaginationDto } from '../admin/dto/pagination.dto';
import { UpdatePlanDto } from './dto/plan.update,dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async createPlan(createPlanDto: CreatePlanDto) {
    const { name, price, duration, description } = createPlanDto;

    // Check duplicate plan
    const existingPlan = await this.planRepository.findOne({
      where: {
        name,
      },
    });
    if (existingPlan) {
      throw new ConflictException({
        success: false,
        message: 'Plan already exists',
        data: null,
      });
    }
    const plan = this.planRepository.create({
      name,
      price,
      duration,
      description,
    });
    await this.planRepository.save(plan);
    return {
      success: true,
      message: 'Plan created successfully',
      data: plan,
    };
  }

  async findAllPlans(paginationDto: PaginationDto) {
    const { page, limit, search } = paginationDto;
    const skip = (page - 1) * limit;
    const query = this.planRepository
      .createQueryBuilder('plan')
      .select([
        'plan.id',
        'plan.name',
        'plan.price',
        'plan.duration',
        'plan.description',
        'plan.createdAt',
      ])
      .where('plan.isActive = :isActive', { isActive: true });

    if (typeof search === 'string' && search.trim() !== '') {
      query.andWhere(
        `(
          LOWER(plan.name) LIKE LOWER(:search)
          OR LOWER(plan.description) LIKE LOWER(:search)
        )`,
        {
          search: `%${search.trim()}%`,
        },
      );
    }
    query
      .orderBy('plan.price', 'ASC') // ya createdAt DESC, tumhari requirement ke hisaab se
      .skip(skip)
      .take(limit);

    const [plans, total] = await query.getManyAndCount();

    return {
      success: true,
      message: 'Plans fetched successfully',
      data: plans,
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

  async updatePlan(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException({
        success: false,
        message: 'Plan not found',
        data: null,
      });
    }

    // Optional: Duplicate name check
    if (updatePlanDto.name) {
      const existingPlan = await this.planRepository.findOne({
        where: {
          name: updatePlanDto.name,
        },
      });

      if (existingPlan && existingPlan.id !== id) {
        throw new ConflictException({
          success: false,
          message: 'Plan name already exists',
          data: null,
        });
      }
    }

    Object.assign(plan, updatePlanDto);
    await this.planRepository.save(plan);
    return {
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    };
  } //PATCH /plan/:id

  async deletePlan(id: string) {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['subscriptions'],
    });
    if (!plan) {
      throw new NotFoundException({
        success: false,
        message: 'Plan not found',
        data: null,
      });
    }
    if (plan.subscriptions.length > 0) {
      throw new BadRequestException({
        success: false,
        message:
          'This plan is already assigned to users. Please deactivate it instead.',
        data: null,
      });
    }
    await this.planRepository.remove(plan);
    return {
      success: true,
      message: 'Plan deleted successfully.',
      data: null,
    };
  }

  async togglePlanStatus(id: string) {
    const plan = await this.planRepository.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException({
        success: false,
        message: 'Plan not found',
        data: null,
      });
    }
    plan.isActive = !plan.isActive;

    await this.planRepository.save(plan);

    return {
      success: true,
      message: `Plan ${plan.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: plan,
    };
  }
}
