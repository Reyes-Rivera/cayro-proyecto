import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const recomendaciones: { name: string; lift: number; confidence: number }[] = [];
    const nombresAgregados = new Set<string>();
    
    const filteredRules = this.rules
      .filter((rule) => rule.antecedents.includes(producto))
      .sort((a, b) => {
        if (b.lift !== a.lift) return b.lift - a.lift;
        return b.confidence - a.confidence;
      });

    for (const rule of filteredRules) {
      for (const item of rule.consequents) {
        if (item !== producto && !nombresAgregados.has(item)) {
          recomendaciones.push({ name: item, lift: rule.lift, confidence: rule.confidence });
          nombresAgregados.add(item);
          if (recomendaciones.length >= top_n) break;
        }
      }
      if (recomendaciones.length >= top_n) break;
    }

    if (recomendaciones.length === 0) {
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

      return [];
    }

    const productos = await this.prismaService.product.findMany({
      where: {
        name: { in: recomendaciones.map((r) => r.name) },
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

    const productosOrdenados = recomendaciones.map((r) => {
      const p = productos.find((prod) => prod.name === r.name);
      return { ...p, lift: r.lift, confidence: r.confidence };
    });
    return productosOrdenados;
  }

  async getCartRecommendations(productos: string[], top_n = 5) {
    const recomendaciones: { name: string; lift: number; confidence: number }[] = [];
    const nombresAgregados = new Set<string>();

    for (const producto of productos) {
      const filteredRules = this.rules
        .filter((rule) => rule.antecedents.includes(producto))
        .sort((a, b) => {
          if (b.lift !== a.lift) return b.lift - a.lift;
          return b.confidence - a.confidence;
        });

      for (const rule of filteredRules) {
        for (const item of rule.consequents) {
          if (!productos.includes(item) && !nombresAgregados.has(item)) {
            recomendaciones.push({ name: item, lift: rule.lift, confidence: rule.confidence });
            nombresAgregados.add(item);
            if (recomendaciones.length >= top_n) break;
          }
        }
        if (recomendaciones.length >= top_n) break;
      }

      if (recomendaciones.length >= top_n) break;
    }

    if (recomendaciones.length === 0 && productos.length > 0) {
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

      return [];
    }

    const productosDB = await this.prismaService.product.findMany({
      where: {
        name: { in: recomendaciones.map((r) => r.name) },
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

    const productosOrdenados = recomendaciones.map((r) => {
      const p = productosDB.find((prod) => prod.name === r.name);
      return { ...p, lift: r.lift, confidence: r.confidence };
    });

    return productosOrdenados;
  }
}
