import { IsEnum, IsString } from 'class-validator';
import { CategoryType } from '../entities/category.entitiy';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsEnum(CategoryType)
  type!: CategoryType;
}
