import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  duration!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
