import { Controller, Get } from '@nestjs/common';
import type { AdminDashboardDataDto } from './dto/admin-dashboard-data.dto';
import { AdminDashboardService } from './dashboard-admin.service';

@Controller('admin-dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get()
  async getAdminDashboardData(): Promise<AdminDashboardDataDto> {
    return this.adminDashboardService.getAdminDashboardData();
  }
}
