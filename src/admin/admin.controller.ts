import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRoleGuard } from './admin-role/admin-role.guard';
import { PaginationDto } from './dto/pagination.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get('users')
  findAllUsers(@Query() paginationDto: PaginationDto) {
    return this.adminService.findAllUsers(paginationDto);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  findAllTransactions(@Query() paginationDto: PaginationDto) {
    return this.adminService.findAllTransactions(paginationDto);
  }

  @Get('transactions/user/:userId')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  findTransactionsByUser(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.adminService.findTransactionsByUser(userId, paginationDto);
  }
}
