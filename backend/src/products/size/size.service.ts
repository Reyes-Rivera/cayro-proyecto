import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Size } from '@prisma/client';
import { transcode } from 'buffer';

@Injectable()
export class SizeService {
  constructor(private prismaService: PrismaService) {}

  async create(createSizeDto: CreateSizeDto): Promise<Size> {
    try {
      const res = await this.prismaService.size.findFirst({
        where: { name: createSizeDto.name },
      });
      if (res)
        throw new ConflictException('Esta talla ya se encuentra registrada.');
      return this.prismaService.size.create({ data: createSizeDto });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Size[]> {
    return await this.prismaService.size.findMany();
  }

  async findOne(id: number): Promise<Size> {
    return await this.prismaService.size.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateSizeDto: UpdateSizeDto): Promise<Size> {
    try {
      const sizeFound = await this.prismaService.size.findFirst({
        where: { name: updateSizeDto.name },
      });
      if (sizeFound)
        throw new ConflictException('Esta talla ya se encuentra registrada.');
      const sizeUpdated = await this.prismaService.size.update({
        where: { id },
        data: updateSizeDto,
      });
      if (!sizeUpdated)
        throw new ConflictException(
          'La talla seleccionada no se encuentra registrada.',
        );
      return sizeUpdated;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<Size> {
    try {
      const res = await this.prismaService.size.delete({
        where: { id },
      });
      if (!res)
        throw new ConflictException('No se encontró la talla seleccionada.');
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar la talla porque está relacionada con otros registros.',
        );
      }
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
