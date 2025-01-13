import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Material } from '@prisma/client';

@Injectable()
export class MaterialService {
  constructor(private prismaService: PrismaService) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    try {
      const materialFound = await this.prismaService.material.findFirst({
        where: { name: createMaterialDto.name },
      });
      if (materialFound)
        throw new ConflictException(
          'Este material ya se encuentra registrado.',
        );
      return await this.prismaService.material.create({
        data: createMaterialDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno del servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Material[]> {
    return await this.prismaService.material.findMany();
  }

  async findOne(id: number): Promise<Material> {
    return await this.prismaService.material.findFirst({
      where: { id },
    });
  }

  async update(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    try {
      const materialFound = await this.prismaService.material.findFirst({
        where: { name: updateMaterialDto.name },
      });
      if (materialFound)
        throw new ConflictException(
          'Este material ya se encuentra registrado.',
        );
      const res = await this.prismaService.material.update({
        where: { id },
        data: updateMaterialDto,
      });
      if (!res)
        throw new NotFoundException(
          'El material seleccionado no se encuentra registrado.',
        );
      return res;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<Material> {
    try {
      const res = await this.prismaService.material.delete({
        where: { id },
      });
      if (!res)
        throw new ConflictException('No se encontró el material seleccionada.');
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar el material porque está relacionada con otros registros.',
        );
      }
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
