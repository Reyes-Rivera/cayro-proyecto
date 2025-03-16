import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateFaqCategoryDto } from './dto/create-faq_category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq_category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppLogger } from 'src/utils/logger.service';
import { FAQCategory } from '@prisma/client';

@Injectable()
export class FaqCategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: AppLogger,
  ) {}
  async create(
    createFaqCategoryDto: CreateFaqCategoryDto,
  ): Promise<FAQCategory> {
    try {
      const faqCategoryFound = await this.prismaService.fAQCategory.findFirst({
        where: {
          name: createFaqCategoryDto.name,
        },
      });
      if (faqCategoryFound)
        throw new ConflictException(
          'La categoría ingresada ya se encuentra registrada.',
        );
      return await this.prismaService.fAQCategory.create({
        data: createFaqCategoryDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error al crear categoria.', error.stack);
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<FAQCategory[]> {
    try {
      return await this.prismaService.fAQCategory.findMany();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Error al obtener categoria de preguntas.',
        error.stack,
      );
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} faqCategory`;
  }

  async update(
    id: number,
    updateFaqCategoryDto: UpdateFaqCategoryDto,
  ): Promise<FAQCategory> {
    try {
      const getCategory = await this.prismaService.fAQCategory.findUnique({
        where: {
          name: updateFaqCategoryDto.name,
        },
      });
      if (getCategory)
        throw new ConflictException(
          'La categoría ingresada ya se encuentra registrada.',
        );
      return await this.prismaService.fAQCategory.update({
        where: { id },
        data: updateFaqCategoryDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Error al actualizar categoria de preguntas.',
        error.stack,
      );
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async remove(id: number): Promise<FAQCategory> {
    try {
      const res = await this.prismaService.fAQCategory.delete({
        where: { id },
      });
      if (!res)
        throw new ConflictException('No se encontró la categoria seleccionada.');
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar la categoria porque está relacionada con otros registros.',
        );
      }
      this.logger.error(
        'Error al eliminar categoria de preguntas.',
        error.stack,
      );

      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
