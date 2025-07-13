import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const endOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    // --- Stats Data ---
    const [
      totalSalesCurrentMonth,
      totalSalesPreviousMonth,
      totalOrdersCurrentMonth,
      totalOrdersPreviousMonth,
      totalUsers,
      totalProductsSoldCurrentMonth,
      totalProductsSoldPreviousMonth,
      totalProductsSoldOverall, // Add this line
    ] = await Promise.all([
      this.prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        },
      }),
      this.prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: startOfPreviousMonth, lte: endOfPreviousMonth },
        },
      }),
      this.prisma.sale.count({
        where: {
          createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        },
      }),
      this.prisma.sale.count({
        where: {
          createdAt: { gte: startOfPreviousMonth, lte: endOfPreviousMonth },
        },
      }),
      this.prisma.user.count(),
      this.prisma.saleDetail.aggregate({
        _sum: { quantity: true },
        where: {
          sale: {
            createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
          },
        },
      }),
      this.prisma.saleDetail.aggregate({
        _sum: { quantity: true },
        where: {
          sale: {
            createdAt: { gte: startOfPreviousMonth, lte: endOfPreviousMonth },
          },
        },
      }),
      this.prisma.saleDetail.aggregate({
        // Add this new aggregation
        _sum: { quantity: true },
      }),
    ]);

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return { change: '+0.0%', isPositive: true };
      const percentage = ((current - previous) / previous) * 100;
      return {
        change: `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`,
        isPositive: percentage >= 0,
      };
    };

    const salesValueCurrent =
      totalSalesCurrentMonth._sum.totalAmount?.toNumber() || 0;
    const salesValuePrevious =
      totalSalesPreviousMonth._sum.totalAmount?.toNumber() || 0;
    const salesChange = calculateChange(salesValueCurrent, salesValuePrevious);

    const ordersCountCurrent = totalOrdersCurrentMonth || 0;
    const ordersCountPrevious = totalOrdersPreviousMonth || 0;
    const ordersChange = calculateChange(
      ordersCountCurrent,
      ordersCountPrevious,
    );

    const productsSoldCurrent =
      totalProductsSoldCurrentMonth._sum.quantity || 0;
    const productsSoldPrevious =
      totalProductsSoldPreviousMonth._sum.quantity || 0;
    const productsSoldChange = calculateChange(
      productsSoldCurrent,
      productsSoldPrevious,
    );

    const statsData = [
      {
        title: 'Ventas Totales',
        value: `$${salesValueCurrent.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: salesChange.change,
        isPositive: salesChange.isPositive,
        // ... other static properties from your component
      },
      {
        title: 'Pedidos Totales',
        value: ordersCountCurrent.toLocaleString('es-ES'),
        change: ordersChange.change,
        isPositive: ordersChange.isPositive,
        // ... other static properties
      },
      {
        title: 'Total Usuarios',
        value: totalUsers.toLocaleString('es-ES'),
        change: '+5.6%', // Placeholder, as user growth calculation is more complex
        isPositive: true,
        // ... other static properties
      },
      {
        title: 'Productos Vendidos',
        value: productsSoldCurrent.toLocaleString('es-ES'),
        change: productsSoldChange.change,
        isPositive: productsSoldChange.isPositive,
        // ... other static properties
      },
    ];

    // --- Recent Activity ---
    const recentActivity = await this.prisma.audit.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      select: {
        id: true,
        action: true,
        date: true,
        admin: { select: { name: true, surname: true } },
        company: { select: { title: true } },
      },
    });

    const formattedRecentActivity = recentActivity.map((activity) => {
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
      if (activity.company) {
        description += ` en ${activity.company.title}`;
      }

      // Assign icons and colors based on action type (simplified for example)
      let icon = 'Activity'; // Default icon
      let color =
        'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400';
      if (activity.action.includes('producto')) {
        icon = 'Package';
        color =
          'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400';
      } else if (activity.action.includes('categoría')) {
        icon = 'Tag';
        color =
          'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400';
      } else if (activity.action.includes('pedido')) {
        icon = 'Calendar'; // Using Calendar for orders as per client component
        color =
          'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400';
      }

      return {
        id: activity.id,
        title: activity.action,
        description: description,
        time: time,
        icon: icon, // Send icon name, client component will render LucideReact icon
        color: color,
      };
    });

    // --- Chart Data ---
    // Revenue (Daily) - Last 7 days
    const dailyRevenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0,
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999,
      );

      const salesToday = await this.prisma.sale.aggregate({
        _sum: { totalAmount: true },
        where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      });
      dailyRevenueData.push({
        day: startOfDay
          .toLocaleDateString('es-ES', { weekday: 'short' })
          .slice(0, 3),
        value: salesToday._sum.totalAmount?.toNumber() || 0,
      });
    }

    // Customers (Total, Returning, New)
    const totalCustomers = await this.prisma.user.count();
    const usersWithSales = await this.prisma.user.count({
      where: { sales: { some: {} } },
    });
    const usersWithoutSales = totalCustomers - usersWithSales; // Simplified "new" users

    const returningPercentage =
      totalCustomers > 0 ? (usersWithSales / totalCustomers) * 100 : 0;
    const newPercentage =
      totalCustomers > 0 ? (usersWithoutSales / totalCustomers) * 100 : 0;

    // Product Stats (by Category)
    const saleDetailsWithCategories = await this.prisma.saleDetail.findMany({
      select: {
        quantity: true,
        productVariant: {
          select: {
            product: {
              select: {
                category: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const categoryQuantities: { [key: string]: number } = {};

    for (const detail of saleDetailsWithCategories) {
      const categoryName = detail.productVariant?.product?.category?.name;
      if (categoryName) {
        // Only process if category name exists
        categoryQuantities[categoryName] =
          (categoryQuantities[categoryName] || 0) + detail.quantity;
      }
    }

    const productStats = Object.entries(categoryQuantities)
      .sort(([, quantityA], [, quantityB]) => quantityB - quantityA)
      .slice(0, 3) // Take top 3 categories
      .map(([category, count], index) => ({
        category: category,
        count: count,
        change: '+10%', // Placeholder for change, requires more complex logic
        colorIndex: index,
      }));

    // Customer Growth (Monthly)
    const customerGrowthMonths = [];
    const customerGrowthValues = [];
    for (let i = 5; i >= 0; i--) {
      // Last 6 months
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
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

      const usersInMonth = await this.prisma.user.count({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
      });
      customerGrowthMonths.push(
        startOfMonth.toLocaleDateString('es-ES', { month: 'short' }),
      );
      customerGrowthValues.push(usersInMonth);
    }

    // Customer Habits (Popular/Seasonal Products) - Dynamic Scaling
    const customerHabitsMonths = [];
    const monthlyQuantities: number[] = [];

    for (let i = 6; i >= 0; i--) {
      // Last 7 months
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
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

      const monthlySalesDetails = await this.prisma.saleDetail.aggregate({
        _sum: { quantity: true },
        where: { sale: { createdAt: { gte: startOfMonth, lte: endOfMonth } } },
      });

      monthlyQuantities.push(monthlySalesDetails._sum.quantity || 0);
      customerHabitsMonths.push(
        startOfMonth.toLocaleDateString('es-ES', { month: 'short' }),
      );
    }

    const maxMonthlyQuantity = Math.max(...monthlyQuantities, 1); // Ensure max is at least 1 to avoid division by zero

    const customerHabitsSeen = monthlyQuantities.map((quantity) =>
      quantity > 0
        ? Math.max(1, Math.round((quantity / maxMonthlyQuantity) * 40))
        : 0,
    );
    const customerHabitsSales = monthlyQuantities.map((quantity) =>
      quantity > 0
        ? Math.max(1, Math.round((quantity / maxMonthlyQuantity) * 30))
        : 0,
    ); // Slightly different scale for 'sales'

    return {
      statsData: statsData.map((stat) => ({
        ...stat,
        // Add back static properties that were removed for dynamic data fetching
        bgIcon:
          stat.title === 'Ventas Totales'
            ? 'bg-blue-600'
            : stat.title === 'Pedidos Totales'
              ? 'bg-teal-600'
              : stat.title === 'Total Usuarios'
                ? 'bg-violet-600'
                : 'bg-orange-600',
        bgCard: 'bg-white dark:bg-gray-800',
        textColor:
          stat.title === 'Ventas Totales'
            ? 'text-blue-800 dark:text-blue-100'
            : stat.title === 'Pedidos Totales'
              ? 'text-teal-800 dark:text-teal-100'
              : stat.title === 'Total Usuarios'
                ? 'text-violet-800 dark:text-violet-100'
                : 'text-orange-800 dark:text-orange-100',
        textSecondary:
          stat.title === 'Ventas Totales'
            ? 'text-blue-700/80 dark:text-blue-300/80'
            : stat.title === 'Pedidos Totales'
              ? 'text-teal-700/80 dark:text-teal-300/80'
              : stat.title === 'Total Usuarios'
                ? 'text-violet-700/80 dark:text-violet-300/80'
                : 'text-orange-700/80 dark:text-orange-300/80',
        subtitle:
          stat.title === 'Ventas Totales'
            ? 'Productos vs mes anterior'
            : stat.title === 'Pedidos Totales'
              ? 'Pedidos vs mes anterior'
              : stat.title === 'Total Usuarios'
                ? 'Usuarios registrados'
                : 'Productos vs mes anterior',
        icon:
          stat.title === 'Ventas Totales'
            ? 'DollarSign'
            : stat.title === 'Pedidos Totales'
              ? 'ShoppingCart'
              : stat.title === 'Total Usuarios'
                ? 'Users'
                : 'Package',
      })),
      recentActivity: formattedRecentActivity,
      chartData: {
        revenue: dailyRevenueData,
        customers: {
          total: totalProductsSoldOverall._sum.quantity || 0, // Now correctly total products sold
          percentage: returningPercentage,
          returning: usersWithSales,
          new: usersWithoutSales,
        },
        productStats: productStats.map((stat, index) => ({
          ...stat,
          // Add back static properties for colors
          colorIndex: index, // To map to the client's color logic
        })),
        customerGrowth: {
          months: customerGrowthMonths,
          values: customerGrowthValues,
        },
        customerHabits: {
          months: customerHabitsMonths,
          seen: customerHabitsSeen,
          sales: customerHabitsSales,
        },
      },
    };
  }
}
