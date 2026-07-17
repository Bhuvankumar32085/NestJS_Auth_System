import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../entities/category.entitiy';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}
