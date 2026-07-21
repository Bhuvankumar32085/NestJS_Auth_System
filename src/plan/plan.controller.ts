import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRoleGuard } from '../admin/admin-role/admin-role.guard';
import { CreatePlanDto } from './dto/plan.create.dto';
import { PlanService } from './plan.service';
import { PaginationDto } from '../admin/dto/pagination.dto';
import { UpdatePlanDto } from './dto/plan.update,dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.createPlan(createPlanDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllPlans(@Query() paginationDto: PaginationDto) {
    return this.planService.findAllPlans(paginationDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  updatePlan(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.planService.updatePlan(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  deletePlan(@Param('id') id: string) {
    return this.planService.deletePlan(id);
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  togglePlanStatus(@Param('id') id: string) {
    return this.planService.togglePlanStatus(id);
  }
}
