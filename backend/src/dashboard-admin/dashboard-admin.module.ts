import { Module } from '@nestjs/common';
import { AdminDashboardController } from './dashboard-admin.controller';
import { AdminDashboardService } from './dashboard-admin.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class DashboardAdminModule {}
