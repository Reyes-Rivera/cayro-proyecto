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
      // 1. Verificar si el producto existe
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

      // 2. Separar variantes de los datos del producto
      const { variants: incomingVariants = [], ...productData } =
        updateProductDto;

      // 3. Actualizar datos del producto principal
      await this.prismaService.product.update({
        where: { id },
        data: productData,
      });

      // 4. Identificar variantes a eliminar
      const existingVariantIds = existingProduct.variants.map((v) => v.id);
      const incomingVariantIds = incomingVariants
        .filter((v) => v.id)
        .map((v) => v.id);

      const variantsToDelete = existingVariantIds.filter(
        (existingId) => !incomingVariantIds.includes(existingId),
      );

      // 5. Eliminar variantes que ya no existen
      for (const variantIdToDelete of variantsToDelete) {
        const variantToDelete = existingProduct.variants.find(
          (v) => v.id === variantIdToDelete,
        );

        if (variantToDelete) {
          // Eliminar imágenes de Cloudinary
          for (const image of variantToDelete.images) {
            // Solo eliminar si no es la imagen placeholder
            if (
              image.url !==
              'https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg'
            ) {
              await this.deleteImageFromCloudinary(image.url);
            }
          }

          // Eliminar imágenes de la base de datos
          await this.prismaService.image.deleteMany({
            where: { productVariantId: variantIdToDelete },
          });

          // Eliminar la variante
          await this.prismaService.productVariant.delete({
            where: { id: variantIdToDelete },
          });
        }
      }

      // 6. Manejo de variantes existentes y nuevas
      for (const variantDto of incomingVariants) {
        const {
          id: variantId,
          images: incomingImages = [],
          ...variantData
        } = variantDto;

        if (variantId) {
          // Actualizar variante existente

          // Verificar si el barcode ya existe en OTRAS variantes
          if (variantData.barcode) {
            const existingVariantWithSameBarcode =
              await this.prismaService.productVariant.findFirst({
                where: {
                  barcode: variantData.barcode,
                  id: { not: variantId },
                },
              });

            if (existingVariantWithSameBarcode) {
              throw new HttpException(
                `El código de barras "${variantData.barcode}" ya está en uso en otra variante.`,
                HttpStatus.BAD_REQUEST,
              );
            }
          }

          // Actualizar datos de la variante
          await this.prismaService.productVariant.update({
            where: { id: variantId },
            data: variantData,
          });

          // Obtener imágenes existentes de esta variante
          const existingImages = await this.prismaService.image.findMany({
            where: { productVariantId: variantId },
          });

          // Identificar imágenes a eliminar (las que existían pero ya no están en incomingImages)
          const incomingImageUrls = incomingImages.map((img) => img.url);
          const imagesToDelete = existingImages.filter(
            (existingImg) => !incomingImageUrls.includes(existingImg.url),
          );

          // Eliminar imágenes que ya no existen
          for (const imageToDelete of imagesToDelete) {
            // Solo eliminar de Cloudinary si no es placeholder
            if (
              imageToDelete.url !==
              'https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg'
            ) {
              await this.deleteImageFromCloudinary(imageToDelete.url);
            }
          }

          // Eliminar imágenes de la base de datos
          await this.prismaService.image.deleteMany({
            where: { productVariantId: variantId },
          });

          // Crear las nuevas imágenes
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
          // Crear nueva variante
          if (variantData.barcode) {
            const existingVariant =
              await this.prismaService.productVariant.findFirst({
                where: { barcode: variantData.barcode },
              });

            if (existingVariant) {
              throw new HttpException(
                `El código de barras "${variantData.barcode}" ya está en uso.`,
                HttpStatus.BAD_REQUEST,
              );
            }
          }

          const newVariant = await this.prismaService.productVariant.create({
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
            include: { images: true },
          });
        }
      }

      // 7. Obtener y devolver el producto actualizado
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
