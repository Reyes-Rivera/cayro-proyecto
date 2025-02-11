import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const categoryFound = await this.prismaService.category.findUnique({
        where: { name: createCategoryDto.name },
      });
      if (categoryFound) throw new ConflictException('La categoría ya existe.');

      return await this.prismaService.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.prismaService.category.findMany();
  }

  async findOne(id: number): Promise<Category> {
    return await this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const foundCategory = await this.prismaService.category.findUnique({
        where: { name: updateCategoryDto.name },
      });
      if (foundCategory)
        throw new ConflictException('Esta categoría ya existe.');
      return await this.prismaService.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<Category> {
    try {
      const foundCategory = await this.prismaService.category.findFirst({
        where: { id },
      });
      if (!foundCategory)
        throw new ConflictException(
          'Esta categoría no se encuentra registrada.',
        );
      return await this.prismaService.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar el genero porque está relacionado con otros registros.',
        );
      }
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
