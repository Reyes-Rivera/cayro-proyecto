// Replicating DTOs from NestJS backend for type safety in the frontend

export interface AdminStatDto {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string; // Name of the Lucide icon (e.g., "Users", "HelpCircle")
  bgIcon: string;
  bgCard: string;
  textColor: string;
  textSecondary: string;
  subtitle: string;
}

export interface AdminRecentActivityDto {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string; // Name of the Lucide icon (e.g., "HelpCircle", "UserPlus")
  color: string;
}

export interface EmployeeStatsDto {
  total: number;
  byRole: {
    admin: { count: number; change: string };
    employee: { count: number; change: string };
  };
}

export interface FaqStatsDto {
  months: string[];
  values: number[];
}

export interface EmployeeGrowthDto {
  months: string[];
  hired: number[];
  active: number[];
}

export interface DocumentStatsDto {
  policies: { count: number; change: string };
  terms: { count: number; change: string };
  guides: { count: number; change: string };
}

export interface AdminDashboardDataDto {
  adminStatsData: AdminStatDto[];
  adminRecentActivity: AdminRecentActivityDto[];
  adminChartData: {
    employeeStats: EmployeeStatsDto;
    faqStats: FaqStatsDto;
    employeeGrowth: EmployeeGrowthDto;
    documentStats: DocumentStatsDto;
  };
}
