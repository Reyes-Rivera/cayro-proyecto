// This file defines the DTO (Data Transfer Object) for the dashboard data.
// It's good practice for type safety and API documentation.

export class StatDataDto {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: string // Name of the Lucide icon
  bgIcon: string
  bgCard: string
  textColor: string
  textSecondary: string
  subtitle: string
}

export class RecentActivityDto {
  id: number
  title: string
  description: string
  time: string
  icon: string // Name of the Lucide icon
  color: string
}

export class RevenueChartDataDto {
  day: string
  value: number
}

export class CustomerChartDataDto {
  total: number
  percentage: number
  returning: number
  new: number
}

export class ProductStatDto {
  category: string
  count: number
  change: string
  colorIndex: number
}

export class CustomerGrowthChartDataDto {
  months: string[]
  values: number[]
}

export class CustomerHabitsChartDataDto {
  months: string[]
  seen: number[]
  sales: number[]
}

export class DashboardDataDto {
  statsData: StatDataDto[]
  recentActivity: RecentActivityDto[]
  chartData: {
    revenue: RevenueChartDataDto[]
    customers: CustomerChartDataDto
    productStats: ProductStatDto[]
    customerGrowth: CustomerGrowthChartDataDto
    customerHabits: CustomerHabitsChartDataDto
  }
}
