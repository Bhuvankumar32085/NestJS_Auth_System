import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from './plan.create.dto';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
