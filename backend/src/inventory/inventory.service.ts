import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getInventory({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const skip = (page - 1) * limit;

    // Construimos el where clause con búsqueda solo en el nombre
    const where: any = {};

    if (search) {
      const normalizedSearch = search.replace(/-/g, ' ').trim().toLowerCase();

      where.OR = [
        {
          name: {
            contains: normalizedSearch,
          },
        },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          brand: true,
          category: true,
          gender: true,
          sleeve: true,
          variants: {
            include: {
              color: true,
              size: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Filtrar productos que coincidan con la búsqueda (solo en nombre)
    const filteredProducts = search
      ? products.filter((product) => {
          const searchTerm = search.replace(/-/g, ' ').trim().toLowerCase();
          return product.name.toLowerCase().includes(searchTerm);
        })
      : products;

    const productsWithStats = filteredProducts.map((product) => {
      const totalStock = product.variants.reduce(
        (sum, variant) => sum + variant.stock,
        0,
      );
      const totalReserved = product.variants.reduce(
        (sum, variant) => sum + variant.reserved,
        0,
      );
      const totalAvailable = totalStock - totalReserved;
      const totalValue = product.variants.reduce(
        (sum, variant) => sum + variant.price * variant.stock,
        0,
      );

      return {
        ...product,
        totalStock,
        totalReserved,
        totalAvailable,
        totalValue,
        variantCount: product.variants.length,
      };
    });

    return {
      products: productsWithStats,
      pagination: {
        page,
        limit,
        total: search ? filteredProducts.length : total,
        totalPages: Math.ceil(
          (search ? filteredProducts.length : total) / limit,
        ),
      },
    };
  }

  async getInventoryStats() {
    const [
      totalProducts,
      totalVariants,
      lowStockCount,
      outOfStockCount,
      totalValue,
    ] = await Promise.all([
      this.prisma.product.count({ where: { active: true } }),
      this.prisma.productVariant.count(),
      this.prisma.productVariant.count({
        where: {
          stock: { lte: 5, gt: 0 },
        },
      }),
      this.prisma.productVariant.count({
        where: { stock: 0 },
      }),
      this.prisma.productVariant.aggregate({
        _sum: {
          stock: true,
        },
      }),
    ]);

    const totalInventoryValue = await this.prisma.productVariant
      .findMany({
        select: {
          price: true,
          stock: true,
        },
      })
      .then((variants) =>
        variants.reduce(
          (sum, variant) => sum + variant.price * variant.stock,
          0,
        ),
      );

    return {
      totalProducts,
      totalVariants,
      lowStockCount,
      outOfStockCount,
      totalStock: totalValue._sum.stock || 0,
      totalInventoryValue,
    };
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        gender: true,
        sleeve: true,
        variants: {
          include: {
            color: true,
            size: true,
            images: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const totalStock = product.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0,
    );
    const totalReserved = product.variants.reduce(
      (sum, variant) => sum + variant.reserved,
      0,
    );
    const totalValue = product.variants.reduce(
      (sum, variant) => sum + variant.price * variant.stock,
      0,
    );

    return {
      ...product,
      totalStock,
      totalReserved,
      totalAvailable: totalStock - totalReserved,
      totalValue,
      variantCount: product.variants.length,
    };
  }

  async getProductVariants(productId: number) {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      include: {
        color: true,
        size: true,
        images: true,
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
    });

    return variants.map((variant) => ({
      ...variant,
      available: variant.stock - variant.reserved,
    }));
  }

  async updateVariantStock(variantId: number, updateStockDto: UpdateStockDto) {
    const { adjustmentType, quantity, reason } = updateStockDto;

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(
        `Product variant with ID ${variantId} not found`,
      );
    }

    let newStock: number;
    if (adjustmentType === 'ADD') {
      newStock = variant.stock + quantity;
    } else if (adjustmentType === 'SUBTRACT') {
      newStock = Math.max(0, variant.stock - quantity);
    } else {
      throw new Error('Invalid adjustment type');
    }

    const updatedVariant = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
      include: {
        color: true,
        size: true,
        product: {
          include: {
            brand: true,
          },
        },
      },
    });

    return {
      ...updatedVariant,
      available: updatedVariant.stock - updatedVariant.reserved,
      previousStock: variant.stock,
      adjustment: adjustmentType === 'ADD' ? quantity : -quantity,
    };
  }

  async getLowStockProducts(threshold: number) {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        stock: { lte: threshold, gt: 0 },
      },
      include: {
        color: true,
        size: true,
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
    });

    return variants.map((variant) => ({
      ...variant,
      available: variant.stock - variant.reserved,
    }));
  }

  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getBrands() {
    return this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getColors() {
    return this.prisma.color.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getSizes() {
    return this.prisma.size.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
