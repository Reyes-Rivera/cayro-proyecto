// src/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
  async getPendingNotifications(userId: number, since?: number) {
    // Si se proporciona 'since', filtrar por fecha
    const whereCondition: any = {
      userId,
      NOT: {
        status: {
          in: [SaleStatus.DELIVERED, SaleStatus.CANCELLED],
        },
      },
    };

    // Si se proporciona timestamp, filtrar ventas actualizadas desde esa fecha
    if (since) {
      const sinceDate = new Date(since);
      whereCondition.OR = [
        { createdAt: { gte: sinceDate } },
        { updatedAt: { gte: sinceDate } },
      ];
    }

    const sales = await this.prisma.sale.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        saleDetails: {
          include: {
            productVariant: {
              include: {
                product: true,
                color: true,
                size: true,
              },
            },
          },
        },
      },
    });

    // Si no hay ventas y se está haciendo polling, devolver array vacío en lugar de error
    if (!sales.length && since) {
      return [];
    }

    // Si no hay ventas en consulta inicial, lanzar error
    if (!sales.length) {
      throw new NotFoundException(
        'No hay notificaciones de pedidos pendientes.',
      );
    }

    // Armar notificaciones
    const notifications = sales.map((sale) => ({
      saleId: sale.id,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      totalAmount: sale.totalAmount,
      status: sale.status,
      message: this.getNotificationMessage(sale.status),
      items: sale.saleDetails.map((detail) => ({
        productName: detail.productVariant.product.name,
        color: detail.productVariant.color.name,
        size: detail.productVariant.size.name,
        quantity: detail.quantity,
      })),
    }));

    return notifications;
  }

  // Nuevo método específico para polling
  async checkForUpdates(userId: number, lastUpdate: number) {
    const sinceDate = new Date(lastUpdate);

    const sales = await this.prisma.sale.findMany({
      where: {
        userId,
        NOT: {
          status: {
            in: [SaleStatus.DELIVERED, SaleStatus.CANCELLED],
          },
        },
        updatedAt: {
          gt: sinceDate, // Mayor que la última actualización
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        saleDetails: {
          include: {
            productVariant: {
              include: {
                product: true,
                color: true,
                size: true,
              },
            },
          },
        },
      },
    });

    const hasUpdates = sales.length > 0;

    // Si hay actualizaciones, devolver todas las notificaciones actuales
    if (hasUpdates) {
      const allNotifications = await this.getPendingNotifications(userId);
      return {
        hasUpdates: true,
        notifications: allNotifications,
        timestamp: Date.now(),
      };
    }

    return {
      hasUpdates: false,
      notifications: [],
      timestamp: Date.now(),
    };
  }

  private getNotificationMessage(status: SaleStatus): string {
    switch (status) {
      case SaleStatus.PENDING:
        return 'Tu pedido fue recibido y está pendiente de revisión.';
      case SaleStatus.PROCESSING:
        return 'Estamos revisando tu pedido.';
      case SaleStatus.PACKED:
        return 'Tu pedido ha sido empacado y está listo para recoger.';
      case SaleStatus.SHIPPED:
        return 'Tu pedido ha sido enviado. ¡En camino!';
      default:
        return 'Tu pedido está en proceso.';
    }
  }

  async verifySmartWatchCode(code: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { smartWatchCode: code },
      });

      if (!user) {
        throw new NotFoundException('Código de reloj no válido.');
      }

      return {
        userId: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error al verificar el código del reloj inteligente.');
    }
  }
}
