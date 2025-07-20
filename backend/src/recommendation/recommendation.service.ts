import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

interface AssociationRule {
  antecedents: string[];
  consequents: string[];
  support: number;
  confidence: number;
  lift: number;
  [key: string]: any;
}

@Injectable()
export class RecommendationService {
  private rules: any[];

  constructor(private prismaService: PrismaService) {
    const rulesPath = path.resolve(
      process.cwd(),
      'src',
      'recommendation',
      'data',
      'reglas_asociacion.json',
    );
    const rawData = fs.readFileSync(rulesPath, 'utf-8');
    this.rules = JSON.parse(rawData);
  }

  async getRecommendations(producto: string, top_n = 5) {
    const recomendaciones = new Set<string>();

    const filteredRules = this.rules
      .filter((rule) => rule.antecedents.includes(producto))
      .sort((a, b) => {
        if (b.lift !== a.lift) return b.lift - a.lift;
        return b.confidence - a.confidence;
      });

    for (const rule of filteredRules) {
      for (const item of rule.consequents) {
        if (item !== producto && !recomendaciones.has(item)) {
          recomendaciones.add(item);
          if (recomendaciones.size >= top_n) break;
        }
      }
      if (recomendaciones.size >= top_n) break;
    }

    if (recomendaciones.size === 0) {
      // Si no hay reglas, buscar productos similares por categoría
      const original = await this.prismaService.product.findUnique({
        where: { name: producto },
        select: { categoryId: true },
      });

      if (original) {
        return this.prismaService.product.findMany({
          where: {
            categoryId: original.categoryId,
            name: { not: producto },
          },
          take: 8,
          include: {
            category: true,
            brand: true,
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
      }

      return []; // Producto no encontrado
    }

    return await this.prismaService.product.findMany({
      where: {
        name: { in: Array.from(recomendaciones) },
      },
      include: {
        category: true,
        brand: true,
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
  }

  async getCartRecommendations(productos: string[], top_n = 5) {
    const recomendaciones = new Set<string>();

    for (const producto of productos) {
      const filteredRules = this.rules
        .filter((rule) => rule.antecedents.includes(producto))
        .sort((a, b) => {
          if (b.lift !== a.lift) return b.lift - a.lift;
          return b.confidence - a.confidence;
        });

      for (const rule of filteredRules) {
        for (const item of rule.consequents) {
          if (!productos.includes(item) && !recomendaciones.has(item)) {
            recomendaciones.add(item);
            if (recomendaciones.size >= top_n) break;
          }
        }
        if (recomendaciones.size >= top_n) break;
      }

      if (recomendaciones.size >= top_n) break;
    }

    if (recomendaciones.size === 0 && productos.length > 0) {
      const original = await this.prismaService.product.findUnique({
        where: { name: productos[0] },
        select: { categoryId: true },
      });

      if (original) {
        return this.prismaService.product.findMany({
          where: {
            categoryId: original.categoryId,
            name: { notIn: productos },
          },
          take: 8,
          include: {
            category: true,
            brand: true,
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
      }

      return []; // Primer producto no encontrado
    }

    return await this.prismaService.product.findMany({
      where: {
        name: { in: Array.from(recomendaciones) },
      },
      include: {
        category: true,
        brand: true,
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
  }
}
