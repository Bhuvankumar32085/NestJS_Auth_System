import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../auth/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('summary')
  @UseGuards(JwtAuthGuard)
  getSummary(@Request() req: AuthRequest) {
    return this.dashboardService.getSummary(req.user.id as string);
  }

  @Get('monthly-summary')
  @UseGuards(JwtAuthGuard) //GET /dashboard/monthly-summary?year=2026
  getMonthlySummary(@Request() req: AuthRequest, @Query('year') year: number) {
    return this.dashboardService.getMonthlySummary(
      req.user.id as string,
      Number(year),
    );
  }

  @Get('daily-summary')
  @UseGuards(JwtAuthGuard)
  getDailySummary(
    @Request() req: AuthRequest,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.dashboardService.getDailySummary(
      req.user.id as string,
      Number(month),
      Number(year),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getTransactions(
    @Request() req: AuthRequest,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.dashboardService.getTransactions(
      req.user.id as string,
      paginationDto,
    );
  }
}
