// This file defines the DTOs for the admin dashboard data.

export class AdminStatDto {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string; // Name of the Lucide icon
  bgIcon: string;
  bgCard: string;
  textColor: string;
  textSecondary: string;
  subtitle: string;
}

export class AdminRecentActivityDto {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string; // Name of the Lucide icon
  color: string;
}

export class EmployeeStatsDto {
  total: number;
  byRole: {
    admin: { count: number; change: string };
    employee: { count: number; change: string };
  };
}

export class FaqStatsDto {
  months: string[];
  values: number[];
}

export class EmployeeGrowthDto {
  months: string[];
  hired: number[];
  active: number[];
}

export class DocumentStatsDto {
  policies: { count: number; change: string };
  terms: { count: number; change: string };
  guides: { count: number; change: string };
}

export class AdminDashboardDataDto {
  adminStatsData: AdminStatDto[];
  adminRecentActivity: AdminRecentActivityDto[];
  adminChartData: {
    employeeStats: EmployeeStatsDto;
    faqStats: FaqStatsDto;
    employeeGrowth: EmployeeGrowthDto;
    documentStats: DocumentStatsDto;
  };
}

// Enum para el tipo de documento, movido aquí para evitar el error de importación
export enum DocumentTypeInter {
  POLICIES = 'POLICIES',
  TERMS_AND_CONDITIONS = 'TERMS_AND_CONDITIONS',
  LEGAL_DISCLAIMER = 'LEGAL_DISCLAIMER',
}
