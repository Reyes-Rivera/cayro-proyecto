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

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const { variants, ...productData } = createProductDto;
    try {
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
      });
      if (existingProduct)
        throw new ConflictException('El producto ya se encuentra registrado.');
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
              imageUrl: variant.imageUrl ?? '',
            })),
          },
        },
        include: { variants: true },
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

  async findAll() {
    return await this.prismaService.product.findMany({
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
  }

  async findOne(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const existingProduct = await this.prismaService.product.findUnique({
        where: { id },
        include: { variants: true },
      });

      if (!existingProduct) {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }

      const { variants: incomingVariants, ...productData } = updateProductDto;

      // Actualiza el producto principal
      await this.prismaService.product.update({
        where: { id },
        data: {
          ...productData,
        },
      });

      // Manejo de variantes
      for (const variantDto of incomingVariants) {
        if (variantDto.id) {
          // Si tiene ID, actualizarla
          await this.prismaService.productVariant.update({
            where: { id: variantDto.id },
            data: {
              colorId: variantDto.colorId,
              sizeId: variantDto.sizeId,
              price: variantDto.price,
              stock: variantDto.stock,
              barcode: variantDto.barcode,
              imageUrl: variantDto.imageUrl ?? '',
            },
          });
        } else {
          // Si no tiene ID, crear nueva
          await this.prismaService.productVariant.create({
            data: {
              productId: id,
              colorId: variantDto.colorId,
              sizeId: variantDto.sizeId,
              price: variantDto.price,
              stock: variantDto.stock,
              barcode: variantDto.barcode,
              imageUrl: variantDto.imageUrl ?? '',
            },
          });
        }
      }

      // Regresa el producto actualizado con relaciones
      const finalProduct = await this.prismaService.product.findUnique({
        where: { id },
        include: {
          variants: {
            include: {
              color: { select: { id: true, name: true } },
              size: { select: { id: true, name: true } },
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
      if (error instanceof HttpException) throw error;
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
