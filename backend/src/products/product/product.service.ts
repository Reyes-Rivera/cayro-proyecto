import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class ProductService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private prismaService: PrismaService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const { variants, ...productData } = createProductDto;
    try {
      // Verificar si el producto ya existe
      const existingProduct = await this.prismaService.product.findFirst({
        where: {
          OR: [
            { name: productData.name },
            { description: productData.description },
            {
              variants: {
                some: { barcode: { in: variants.map((v) => v.barcode) } },
              },
            },
          ],
        },
        include: { variants: true },
      });

      if (existingProduct) {
        throw new ConflictException('El producto ya se encuentra registrado.');
      }

      // Crear el producto con sus variantes e imágenes
      const product = await this.prismaService.product.create({
        data: {
          ...productData,
          variants: {
            create: variants.map((variant) => ({
              colorId: variant.colorId,
              sizeId: variant.sizeId,
              price: variant.price,
              stock: variant.stock,
              barcode: variant.barcode,
              images: {
                create:
                  variant.images?.map((image) => ({
                    url: image.url,
                    angle: image.angle || 'front', // Valor por defecto si no se especifica
                  })) || [], // Array vacío si no hay imágenes
              },
            })),
          },
        },
        include: {
          variants: {
            include: {
              images: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({
    search,
    category,
    priceMin,
    priceMax,
    colors,
    sizes,
    genders,
    sleeves,
    page,
    limit,
  }: {
    search?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    colors?: string;
    sizes?: string;
    genders?: string;
    sleeves?: string;
    page: number;
    limit: number;
  }) {
    // Construimos el where clause principal
    const where: any = {};

    // Filtro por búsqueda (con manejo de guiones y case insensitive)
    if (search) {
      const normalizedSearch = search.replace(/-/g, ' ').trim();
      where['name'] = {
        contains: normalizedSearch.toLowerCase(), // Convertir a minúsculas
      };
    }

    // Filtro por categoría
    if (category) {
      where['categoryId'] = parseInt(category);
    }

    // Construcción del filtro de variantes (para precios, colores y tallas)
    const variantsFilter: any = {};

    // Filtro combinado por rango de precios
    if (priceMin !== undefined || priceMax !== undefined) {
      variantsFilter.price = {};
      if (priceMin !== undefined) variantsFilter.price.gte = +priceMin;
      if (priceMax !== undefined) variantsFilter.price.lte = +priceMax;
    }

    // Filtro por colores
    if (colors) {
      const colorIds = colors
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
      variantsFilter.colorId = { in: colorIds };
    }

    // Filtro por tallas
    if (sizes) {
      const sizeIds = sizes
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
      variantsFilter.sizeId = { in: sizeIds };
    }

    // Aplicar filtros de variantes si existen
    if (Object.keys(variantsFilter).length > 0) {
      where['variants'] = { some: variantsFilter };
    }

    // Filtro por géneros
    if (genders) {
      const genderIds = genders
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
      where['genderId'] = { in: genderIds };
    }

    // Filtro por tipo de cuello (sleeve)
    if (sleeves) {
      const sleeveIds = sleeves
        .split(',')
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));
      where['sleeveId'] = { in: sleeveIds };
    }

    // Configuración de la consulta para los productos
    const findManyQuery = {
      where,
      include: {
        variants: {
          include: {
            color: true,
            size: true,
            images: true,
          },
          // Filtro opcional para las variantes incluidas en la respuesta
          where: variantsFilter,
        },
        gender: true,
        sleeve: true,
        category: true,
      },
      skip: (page - 1) * +limit,
      take: +limit,
    };

    // Configuración para el conteo total
    const countQuery = { where };

    const [results, total] = await Promise.all([
      this.prismaService.product.findMany(findManyQuery),
      this.prismaService.product.count(countQuery),
    ]);

    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(slug: string) {
    // Convierte el slug 'polo-hombre' a 'Polo Hombre'
    const name = slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const product = await this.prismaService.product.findFirst({
      where: {
        name: name,
      },
      include: {
        variants: {
          include: {
            color: {
              select: {
                id: true,
                name: true,
                hexValue: true,
              },
            },
            images: true,
            size: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        brand: true,
        gender: true,
        sleeve: true,
        category: true,
      },
    });

    return product;
  }

  async findById(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: +id,
      },
      include: {
        variants: {
          include: {
            color: {
              select: {
                id: true,
                name: true,
                hexValue: true,
              },
            },
            images: true,
            size: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        brand: true,
        gender: true,
        sleeve: true,
        category: true,
      },
    });

    return product;
  }

  private extractPublicIdFromUrl(url: string): string {
    try {
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex === -1) throw new Error('Invalid Cloudinary URL');

      const path = url.substring(uploadIndex + '/upload/'.length);
      const parts = path.split('/');
      const fileName = parts[parts.length - 1];

      return fileName.replace(/\.[^/.]+$/, ''); // Remover extensión
    } catch (e) {
      throw new Error('Invalid Cloudinary URL format');
    }
  }

  // Función para eliminar imagen de Cloudinary
  private async deleteImageFromCloudinary(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      await this.cloudinaryService.deleteImage(publicId);
      console.log(`Imagen eliminada de Cloudinary exitosamente: ${imageUrl}`);
    } catch (error) {
      console.error('Error al eliminar imagen de Cloudinary:', error.message);
      // No lanzar error para no interrumpir el flujo principal
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { id },
        include: {
          variants: {
            include: {
              images: true,
            },
          },
        },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }

      const { variants: incomingVariants = [], ...productData } =
        updateProductDto;

      await this.prismaService.product.update({
        where: { id },
        data: productData,
      });

      const existingVariantIds = existingProduct.variants.map((v) => v.id);
      const incomingVariantIds = incomingVariants
        .filter((v) => v.id)
        .map((v) => v.id);

      const variantsToUnlink = existingVariantIds.filter(
        (existingId) => !incomingVariantIds.includes(existingId),
      );

      for (const variantIdToUnlink of variantsToUnlink) {
        await this.prismaService.productVariant.update({
          where: { id: variantIdToUnlink },
          data: {
            product: { disconnect: true },
          },
        });
      }

      for (const variantDto of incomingVariants) {
        const {
          id: variantId,
          images: incomingImages = [],
          ...variantData
        } = variantDto;

        if (variantId) {
          if (variantData.barcode) {
            const existingWithSameBarcode =
              await this.prismaService.productVariant.findFirst({
                where: {
                  barcode: variantData.barcode,
                  id: { not: variantId },
                },
              });
            if (existingWithSameBarcode) {
              throw new HttpException(
                `El código de barras "${variantData.barcode}" ya está en uso en otra variante.`,
                HttpStatus.BAD_REQUEST,
              );
            }
          }

          await this.prismaService.productVariant.update({
            where: { id: variantId },
            data: variantData,
          });

          const existingImages = await this.prismaService.image.findMany({
            where: { productVariantId: variantId },
          });

          const incomingImageUrls = incomingImages.map((img) => img.url);
          const imagesToDelete = existingImages.filter(
            (existingImg) => !incomingImageUrls.includes(existingImg.url),
          );

          for (const imageToDelete of imagesToDelete) {
            if (
              imageToDelete.url !==
              'https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg'
            ) {
              await this.deleteImageFromCloudinary(imageToDelete.url);
            }
          }

          await this.prismaService.image.deleteMany({
            where: { productVariantId: variantId },
          });

          if (incomingImages.length > 0) {
            await this.prismaService.image.createMany({
              data: incomingImages.map((image) => ({
                url: image.url,
                angle: image.angle || 'front',
                productVariantId: variantId,
              })),
            });
          }
        } else {
          const reusedVariant =
            await this.prismaService.productVariant.findFirst({
              where: {
                colorId: variantData.colorId,
                sizeId: variantData.sizeId,
                productId: null,
              },
            });

          if (reusedVariant) {
            if (variantData.barcode) {
              const duplicateBarcode =
                await this.prismaService.productVariant.findFirst({
                  where: {
                    barcode: variantData.barcode,
                    id: { not: reusedVariant.id },
                  },
                });
              if (duplicateBarcode) {
                throw new HttpException(
                  `El código de barras "${variantData.barcode}" ya está en uso.`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            }

            await this.prismaService.productVariant.update({
              where: { id: reusedVariant.id },
              data: {
                ...variantData,
                productId: id,
              },
            });

            const existingImages = await this.prismaService.image.findMany({
              where: { productVariantId: reusedVariant.id },
            });

            for (const imageToDelete of existingImages) {
              if (
                imageToDelete.url !==
                'https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg'
              ) {
                await this.deleteImageFromCloudinary(imageToDelete.url);
              }
            }

            await this.prismaService.image.deleteMany({
              where: { productVariantId: reusedVariant.id },
            });

            if (incomingImages.length > 0) {
              await this.prismaService.image.createMany({
                data: incomingImages.map((image) => ({
                  url: image.url,
                  angle: image.angle || 'front',
                  productVariantId: reusedVariant.id,
                })),
              });
            }
          } else {
            if (variantData.barcode) {
              const duplicate =
                await this.prismaService.productVariant.findFirst({
                  where: { barcode: variantData.barcode },
                });
              if (duplicate) {
                throw new HttpException(
                  `El código de barras "${variantData.barcode}" ya está en uso.`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            }

            await this.prismaService.productVariant.create({
              data: {
                ...variantData,
                productId: id,
                images: {
                  create: incomingImages.map((image) => ({
                    url: image.url,
                    angle: image.angle || 'front',
                  })),
                },
              },
            });
          }
        }
      }

      const finalProduct = await this.prismaService.product.findUnique({
        where: { id },
        include: {
          variants: {
            include: {
              color: { select: { id: true, name: true } },
              size: { select: { id: true, name: true } },
              images: true,
            },
          },
          brand: true,
          gender: true,
          sleeve: true,
          category: true,
        },
      });

      return finalProduct;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      if (error instanceof HttpException) throw error;
      if (error.code === 'P2002') {
        throw new HttpException(
          `El código de barras ya está en uso.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePricesBulk(filters: any, updateData: any) {
    try {
      // Construir la consulta WHERE basada en los filtros SELECCIONADOS
      const whereConditions: any = {};
      const productWhere: any = {};

      // ✅ Solo se aplican los filtros que tienen valores
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        productWhere.categoryId = { in: filters.categoryIds };
        console.log(`Filtrando por categorías: ${filters.categoryIds}`);
      }

      if (filters.brandIds && filters.brandIds.length > 0) {
        productWhere.brandId = { in: filters.brandIds };
        console.log(`Filtrando por marcas: ${filters.brandIds}`);
      }

      if (filters.genderIds && filters.genderIds.length > 0) {
        productWhere.genderId = { in: filters.genderIds };
        console.log(`Filtrando por géneros: ${filters.genderIds}`);
      }

      // Filtros para las variantes
      if (filters.colorIds && filters.colorIds.length > 0) {
        whereConditions.colorId = { in: filters.colorIds };
        console.log(`Filtrando por colores: ${filters.colorIds}`);
      }

      if (filters.sizeIds && filters.sizeIds.length > 0) {
        whereConditions.sizeId = { in: filters.sizeIds };
        console.log(`Filtrando por tallas: ${filters.sizeIds}`);
      }

      // Si hay filtros de producto, agregarlos a la consulta de variantes
      if (Object.keys(productWhere).length > 0) {
        whereConditions.product = productWhere;
      }

      console.log(
        'Consulta final WHERE:',
        JSON.stringify(whereConditions, null, 2),
      );

      // Obtener las variantes que coinciden con los filtros
      const variants = await this.prismaService.productVariant.findMany({
        where: whereConditions,
        select: {
          id: true,
          price: true,
          product: {
            select: {
              name: true,
              category: { select: { name: true } },
              brand: { select: { name: true } },
              gender: { select: { name: true } },
            },
          },
          color: { select: { name: true } },
          size: { select: { name: true } },
        },
      });

      console.log(
        `Se encontraron ${variants.length} variantes que coinciden con los filtros`,
      );

      if (variants.length === 0) {
        throw new HttpException(
          'No se encontraron productos que coincidan con los filtros.',
          HttpStatus.NOT_FOUND,
        );
      }

      // ✅ LÓGICA COMPLETA DE ACTUALIZACIÓN DE PRECIOS
      const updatePromises = variants.map(async (variant) => {
        let newPrice: number;
        const currentPrice = variant.price;

        console.log(
          `Procesando variante ${variant.id} - Precio actual: $${currentPrice}`,
        );

        switch (updateData.operation) {
          case 'increase':
            if (updateData.updateType === 'percentage') {
              newPrice = currentPrice * (1 + updateData.value / 100);
              console.log(
                `Aumentando ${updateData.value}%: $${currentPrice} -> $${newPrice.toFixed(2)}`,
              );
            } else {
              // updateType === "amount"
              newPrice = currentPrice + updateData.value;
              console.log(
                `Aumentando $${updateData.value}: $${currentPrice} -> $${newPrice.toFixed(2)}`,
              );
            }
            break;

          case 'decrease':
            if (updateData.updateType === 'percentage') {
              newPrice = currentPrice * (1 - updateData.value / 100);
              console.log(
                `Disminuyendo ${updateData.value}%: $${currentPrice} -> $${newPrice.toFixed(2)}`,
              );
            } else {
              // updateType === "amount"
              newPrice = currentPrice - updateData.value;
              console.log(
                `Disminuyendo $${updateData.value}: $${currentPrice} -> $${newPrice.toFixed(2)}`,
              );
            }
            break;

          case 'set':
            newPrice = updateData.value;
            console.log(
              `Estableciendo precio fijo: $${currentPrice} -> $${newPrice.toFixed(2)}`,
            );
            break;

          default:
            throw new HttpException(
              'Operación no válida. Use: increase, decrease, o set',
              HttpStatus.BAD_REQUEST,
            );
        }

        // Asegurar que el precio no sea negativo
        newPrice = Math.max(0, Math.round(newPrice * 100) / 100); // Redondear a 2 decimales

        // Actualizar la variante en la base de datos
        return this.prismaService.productVariant.update({
          where: { id: variant.id },
          data: { price: newPrice },
        });
      });

      // Ejecutar todas las actualizaciones
      const updatedVariants = await Promise.all(updatePromises);

      console.log(
        `✅ Se actualizaron ${updatedVariants.length} variantes exitosamente`,
      );

      return {
        success: true,
        message: `Se actualizaron ${variants.length} variantes de productos exitosamente.`,
        updatedCount: variants.length,
        operation: updateData.operation,
        updateType: updateData.updateType,
        value: updateData.value,
        details: variants.map((v) => ({
          productName: v.product.name,
          category: v.product.category.name,
          brand: v.product.brand.name,
          gender: v.product.gender.name,
          color: v.color.name,
          size: v.size.name,
          oldPrice: v.price,
        })),
      };
    } catch (error) {
      console.error('❌ Error al actualizar precios masivamente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor al actualizar precios.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async remove(id: number) {
    return await this.prismaService.product.update({
      where: { id },
      data: { active: false },
    });
  }
  async active(id: number) {
    return await this.prismaService.product.update({
      where: { id },
      data: { active: true },
    });
  }
}
