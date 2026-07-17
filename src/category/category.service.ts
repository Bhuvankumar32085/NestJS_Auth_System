import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category, CategoryType } from './entities/category.entitiy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto, userId: string) {
    try {
      const { name, type } = createCategoryDto;
      const categoryName = name.trim().toLowerCase();

      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      if (!name || !type) {
        throw new BadRequestException({
          success: false,
          message: 'Name and Category Type are required',
          data: null,
        });
      }

      if (type !== CategoryType.INCOME && type !== CategoryType.EXPENSE) {
        throw new BadRequestException({
          success: false,
          message: 'Category Type must be INCOME or EXPENSE',
          data: null,
        });
      }

      const existingCategory = await this.categoryRepository.findOne({
        where: {
          name: categoryName,
          type,
          user: {
            id: userId,
          },
        },
      });

      if (existingCategory) {
        return {
          success: false,
          message: 'Category already exists',
          data: null,
        };
      }

      const category = this.categoryRepository.create({
        name: categoryName,
        type,
        user: {
          id: userId,
        },
      });

      const savedCategory = await this.categoryRepository.save(category);

      return {
        success: true,
        message: 'Category created successfully',
        data: savedCategory,
      };
    } catch (error) {
      console.error(error);

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

  async getCategories(userId: string) {
    if (!userId) {
      throw new BadRequestException({
        success: false,
        message: 'User Id is required',
        data: null,
      });
    }

    const categories = await this.categoryRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    };
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
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

      if (!categoryId) {
        throw new BadRequestException({
          success: false,
          message: 'Category Id is required',
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

      if (updateCategoryDto.name) {
        const existingCategory = await this.categoryRepository.findOne({
          where: {
            name: updateCategoryDto.name.trim().toLowerCase(),
            type: updateCategoryDto.type ?? category.type,
            user: {
              id: userId,
            },
          },
        });

        if (existingCategory && existingCategory.id !== categoryId) {
          throw new BadRequestException({
            success: false,
            message: 'Category already exists',
            data: null,
          });
        }
      }

      if (
        updateCategoryDto.type &&
        updateCategoryDto.type !== CategoryType.INCOME &&
        updateCategoryDto.type !== CategoryType.EXPENSE
      ) {
        throw new BadRequestException({
          success: false,
          message: 'Category Type must be INCOME or EXPENSE',
          data: null,
        });
      }

      category.name =
        updateCategoryDto.name?.trim().toLowerCase() ?? category.name;
      category.type = updateCategoryDto.type ?? category.type;

      const updatedCategory = await this.categoryRepository.save(category);

      return {
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
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

  async deleteCategory(categoryId: string, userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException({
          success: false,
          message: 'User Id is required',
          data: null,
        });
      }

      if (!categoryId) {
        throw new BadRequestException({
          success: false,
          message: 'Category Id is required',
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

      await this.categoryRepository.remove(category);

      return {
        success: true,
        message: 'Category deleted successfully',
        data: null,
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
}
