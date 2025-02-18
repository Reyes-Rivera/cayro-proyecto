import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSleeveDto } from './dto/create-sleeve.dto';
import { UpdateSleeveDto } from './dto/update-sleeve.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Sleeve } from '@prisma/client';

@Injectable()
export class SleeveService {
  constructor(private prismaService: PrismaService) {}

  async create(createSleeveDto: CreateSleeveDto): Promise<Sleeve> {
    try {
      const sleeveFound = await this.prismaService.sleeve.findFirst({
        where: { name: createSleeveDto.name },
      });
      if (sleeveFound)
        throw new ConflictException(
          'Este tipo de manga ya se encuentra registrada.',
        );
      return await this.prismaService.sleeve.create({
        data: createSleeveDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Sleeve[]> {
    return await this.prismaService.sleeve.findMany();
  }

  async findOne(id: number): Promise<Sleeve> {
    return await this.prismaService.sleeve.findFirst({
      where: { id },
    });
  }

  async update(
    id: number,
    updateSleeveDto: UpdateSleeveDto,
  ): Promise<Sleeve> {
    try {
      const sleeveFound = await this.prismaService.sleeve.findFirst({
        where: { name: updateSleeveDto.name },
      });
      if (sleeveFound)
        throw new ConflictException(
          'Este tipo de manga ya se encuentra registrado.',
        );
      const sleeveUpdated = await this.prismaService.sleeve.update({
        where: { id },
        data: updateSleeveDto,
      });
      if (!sleeveUpdated)
        throw new NotFoundException(
          'El tipo de manga seleccionada no se encuentra registrada.',
        );
      return sleeveUpdated;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
    async remove(id: number): Promise<Sleeve> {
      try {
        const res = await this.prismaService.sleeve.delete({
          where: { id },
        });
        if (!res)
          throw new ConflictException('No se encontró la manga seleccionada.');
        return res;
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        if (error.code === 'P2003') {
          throw new ConflictException(
            'No se puede eliminar la manga porque está relacionada con otros registros.',
          );
        }
        throw new HttpException(
          'Error interno en el servidor.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
}
