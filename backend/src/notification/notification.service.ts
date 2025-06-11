// src/notifications/notifications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaleStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingNotifications(userId: number) {
    const sales = await this.prisma.sale.findMany({
      where: {
        userId,
        NOT: {
          status: {
            in: [SaleStatus.DELIVERED, SaleStatus.CANCELLED],
          },
        },
      },
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

    if (!sales.length) {
      throw new NotFoundException(
        'No hay notificaciones de pedidos pendientes.',
      );
    }

    // Armar notificaciones
    const notifications = sales.map((sale) => ({
      saleId: sale.id,
      createdAt: sale.createdAt,
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

  private getNotificationMessage(status: SaleStatus): string {
    switch (status) {
      case SaleStatus.PENDING:
        return 'Tu pedido fue recibido y está pendiente de revisión.';
      case SaleStatus.PROCESSING:
        return 'Estamos revisando tu pedido.';
      case SaleStatus.PACKED:
        return 'Tu pedido ha sido empacado y está listo para ser enviado.';
      case SaleStatus.SHIPPED:
        return 'Tu pedido ha sido enviado. ¡En camino!';
      default:
        return 'Tu pedido está en proceso.';
    }
  }
}
