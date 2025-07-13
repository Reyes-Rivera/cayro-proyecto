import { Injectable } from '@nestjs/common';
import {
  type AdminDashboardDataDto,
  type AdminStatDto,
  type AdminRecentActivityDto,
  type EmployeeStatsDto,
  type FaqStatsDto,
  type EmployeeGrowthDto,
  type DocumentStatsDto,
  DocumentTypeInter, // Import DocumentTypeInter from the DTO file
} from './dto/admin-dashboard-data.dto'; // Adjusted import path
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  private calculateChange(
    current: number,
    previous: number,
  ): { change: string; isPositive: boolean } {
    if (previous === 0) return { change: '+0.0%', isPositive: true };
    const percentage = ((current - previous) / previous) * 100;
    return {
      change: `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`,
      isPositive: percentage >= 0,
    };
  }

  async getAdminDashboardData(): Promise<AdminDashboardDataDto> {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // --- Admin Stats Data ---
    const [
      totalFaqs,
      totalLegalDocuments,
      totalCompanySettings,
      totalFaqsLastMonth,
      totalLegalDocumentsLastMonth,
    ] = await Promise.all([
      this.prisma.fAQ.count(),
      this.prisma.documentRegulatory.count(),
      this.prisma.configuration.count(),
      this.prisma.fAQ.count({
        where: {
          createdAt: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
      }),
      this.prisma.documentRegulatory.count({
        where: {
          createdAt: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
      }),
    ]);

    const faqChange = this.calculateChange(totalFaqs, totalFaqsLastMonth);
    const legalDocChange = this.calculateChange(
      totalLegalDocuments,
      totalLegalDocumentsLastMonth,
    );

    // Employee Stats - Fetch admin and employee counts separately from the Employee model
    const [adminCount, employeeCount] = await Promise.all([
      this.prisma.employee.count({ where: { role: Role.ADMIN } }), // Changed from this.prisma.user
      this.prisma.employee.count({ where: { role: Role.EMPLOYEE } }), // Changed from this.prisma.user
    ]);

    // Log the counts for debugging
    console.log(`Admin Count from DB (Employee model): ${adminCount}`);
    console.log(`Employee Count from DB (Employee model): ${employeeCount}`);

    const totalEmployeesCalculated = adminCount + employeeCount;
    console.log(`Total Employees Calculated: ${totalEmployeesCalculated}`);

    // Recalculate totalEmployeesLastMonth based on the specific roles from the Employee model
    const totalEmployeesLastMonthCalculated = await this.prisma.employee.count({
      where: {
        role: { in: [Role.ADMIN, Role.EMPLOYEE] },
      },
    });
    console.log(
      `Total Employees Last Month Calculated: ${totalEmployeesLastMonthCalculated}`,
    );

    const employeeChange = this.calculateChange(
      totalEmployeesCalculated,
      totalEmployeesLastMonthCalculated,
    );

    const adminStatsData: AdminStatDto[] = [
      {
        title: 'Total Empleados',
        value: totalEmployeesCalculated.toLocaleString('es-ES'), // Use the calculated total
        change: employeeChange.change,
        isPositive: employeeChange.isPositive,
        icon: 'Users',
        bgIcon: 'bg-blue-600',
        bgCard: 'bg-white dark:bg-gray-800',
        textColor: 'text-blue-800 dark:text-blue-100',
        textSecondary: 'text-blue-700/80 dark:text-blue-300/80',
        subtitle: 'Empleados activos',
      },
      {
        title: 'FAQ Publicadas',
        value: totalFaqs.toLocaleString('es-ES'),
        change: faqChange.change,
        isPositive: faqChange.isPositive,
        icon: 'HelpCircle',
        bgIcon: 'bg-teal-600',
        bgCard: 'bg-white dark:bg-gray-800',
        textColor: 'text-teal-800 dark:text-teal-100',
        textSecondary: 'text-teal-700/80 dark:text-teal-300/80',
        subtitle: 'Preguntas frecuentes',
      },
      {
        title: 'Documentos Legales',
        value: totalLegalDocuments.toLocaleString('es-ES'),
        change: legalDocChange.change,
        isPositive: legalDocChange.isPositive,
        icon: 'FileText',
        bgIcon: 'bg-violet-600',
        bgCard: 'bg-white dark:bg-gray-800',
        textColor: 'text-violet-800 dark:text-violet-100',
        textSecondary: 'text-violet-700/80 dark:text-violet-300/80',
        subtitle: 'Políticas y términos',
      },
      {
        title: 'Configuraciones',
        value: totalCompanySettings.toLocaleString('es-ES'),
        change: '+0.0%',
        isPositive: true,
        icon: 'Building',
        bgIcon: 'bg-orange-600',
        bgCard: 'bg-white dark:bg-gray-800',
        textColor: 'text-orange-800 dark:text-orange-100',
        textSecondary: 'text-orange-700/80 dark:text-orange-300/80',
        subtitle: 'Configuración empresa',
      },
    ];

    // --- Recent Activity ---
    const adminRecentActivityRaw = await this.prisma.audit.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      select: {
        id: true,
        action: true,
        date: true,
        admin: { select: { name: true, surname: true } },
      },
    });

    const adminRecentActivity: AdminRecentActivityDto[] =
      adminRecentActivityRaw.map((activity) => {
        const timeDiff = now.getTime() - activity.date.getTime();
        const minutes = Math.floor(timeDiff / (1000 * 60));
        let time = `${minutes} min`;
        if (minutes >= 60) {
          const hours = Math.floor(minutes / 60);
          time = `${hours} hr`;
          if (hours >= 24) {
            const days = Math.floor(hours / 24);
            time = `${days} día`;
            if (days > 1) time += 's';
          }
        }
        time = `Hace ${time}`;

        let description = activity.action;
        if (activity.admin) {
          description += ` por ${activity.admin.name} ${activity.admin.surname}`;
        }

        let icon = 'Activity';
        let color =
          'bg-gray-100 dark:bg-gray-900/40 text-gray-600 dark:text-gray-400';

        if (activity.action.includes('FAQ')) {
          icon = 'HelpCircle';
          color =
            'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400';
        } else if (
          activity.action.includes('empleado') ||
          activity.action.includes('usuario')
        ) {
          icon = 'UserPlus';
          color =
            'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400';
        } else if (activity.action.includes('documento legal')) {
          icon = 'FileText';
          color =
            'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400';
        } else if (activity.action.includes('configuración')) {
          icon = 'Settings';
          color =
            'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400';
        } else if (activity.action.includes('categoría FAQ')) {
          icon = 'BookOpen';
          color =
            'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400';
        }

        return {
          id: activity.id,
          title: activity.action,
          description: description,
          time: time,
          icon: icon,
          color: color,
        };
      });

    // --- Admin Chart Data ---
    const employeeStats: EmployeeStatsDto = {
      total: totalEmployeesCalculated, // Use the calculated total
      byRole: {
        admin: { count: adminCount, change: '+0%' }, // Placeholder change
        employee: { count: employeeCount, change: '+8%' }, // Placeholder change
      },
    };

    // FAQ Growth
    const faqStatsMonths: string[] = [];
    const faqStatsValues: number[] = [];
    for (let i = 5; i >= 0; i--) {
      // Last 6 months
      const date = new Date(currentYear, currentMonth - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const faqsInMonth = await this.prisma.fAQ.count({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
      });
      faqStatsMonths.push(
        startOfMonth.toLocaleDateString('es-ES', { month: 'short' }),
      );
      faqStatsValues.push(faqsInMonth);
    }

    const faqStats: FaqStatsDto = {
      months: faqStatsMonths,
      values: faqStatsValues,
    };

    // Employee Growth
    const employeeGrowthMonths: string[] = [];
    const hiredValues: number[] = [];
    const activeValues: number[] = [];

    for (let i = 6; i >= 0; i--) {
      // Last 7 months
      const date = new Date(currentYear, currentMonth - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const newHiresInMonth = await this.prisma.employee.count({
        // Changed from this.prisma.user
        where: {
          role: { in: [Role.ADMIN, Role.EMPLOYEE] },
        },
      });

      const activeEmployeesUpToMonth = await this.prisma.employee.count({
        // Changed from this.prisma.user
        where: {
          role: { in: [Role.ADMIN, Role.EMPLOYEE] },
        },
      });

      employeeGrowthMonths.push(
        startOfMonth.toLocaleDateString('es-ES', { month: 'short' }),
      );
      hiredValues.push(newHiresInMonth);
      activeValues.push(activeEmployeesUpToMonth);
    }

    const employeeGrowth: EmployeeGrowthDto = {
      months: employeeGrowthMonths,
      hired: hiredValues,
      active: activeValues,
    };

    // Document Stats (simplified, assuming types based on title or static)
    // For a more robust solution, you'd need a 'type' field in your LegalDocument model
    const policiesCount = await this.prisma.documentRegulatory.count({
      where: { type: DocumentTypeInter.POLICIES },
    });
    const termsCount = await this.prisma.documentRegulatory.count({
      where: { type: DocumentTypeInter.TERMS_AND_CONDITIONS },
    });
    const guidesCount = await this.prisma.documentRegulatory.count({
      where: { type: DocumentTypeInter.LEGAL_DISCLAIMER },
    });

    const documentStats: DocumentStatsDto = {
      policies: { count: policiesCount, change: '+3%' }, // Placeholder change
      terms: { count: termsCount, change: '+2%' }, // Placeholder change
      guides: { count: guidesCount, change: '+1%' }, // Placeholder change
    };

    return {
      adminStatsData,
      adminRecentActivity,
      adminChartData: {
        employeeStats,
        faqStats,
        employeeGrowth,
        documentStats,
      },
    };
  }
}
