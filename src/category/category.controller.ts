import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../auth/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req: AuthRequest,
  ) {
    const userId = req.user.id as string;
    return await this.categoryService.createCategory(createCategoryDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCategories(@Request() req: AuthRequest) {
    return this.categoryService.getCategories(req.user.id as string);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateCategory(
    @Param('id') categoryId: string,
    @Body() dto: UpdateCategoryDto,
    @Request() req: AuthRequest,
  ) {
    console.log(dto);
    return this.categoryService.updateCategory(
      categoryId,
      dto,
      req.user.id as string,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteCategory(@Param('id') categoryId: string, @Request() req: AuthRequest) {
    return this.categoryService.deleteCategory(
      categoryId,
      req.user.id as string,
    );
  }
}
