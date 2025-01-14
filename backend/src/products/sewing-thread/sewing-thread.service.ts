import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSewingThreadDto } from './dto/create-sewing-thread.dto';
import { UpdateSewingThreadDto } from './dto/update-sewing-thread.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SewingThread } from '@prisma/client';

@Injectable()
export class SewingThreadService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createSewingThreadDto: CreateSewingThreadDto,
  ): Promise<SewingThread> {
    try {
      const res = await this.prismaService.sewingThread.findFirst({
        where: { name: createSewingThreadDto.name },
      });
      if (res)
        throw new ConflictException(
          'Este hilo de costura ya se encuentra registrado.',
        );
      return this.prismaService.sewingThread.create({
        data: createSewingThreadDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<SewingThread[]> {
    return await this.prismaService.sewingThread.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.sewingThread.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateSewingThreadDto: UpdateSewingThreadDto) {
    try {
      const sewingThreadFound = await this.prismaService.sewingThread.findFirst(
        {
          where: { name: updateSewingThreadDto.name },
        },
      );
      if (sewingThreadFound)
        throw new ConflictException('Este hilo de costura ya está registrado.');
      const res = await this.prismaService.sewingThread.update({
        where: {
          id,
        },
        data: updateSewingThreadDto,
      });
      if (!res)
        throw new NotFoundException(
          'El hilo de costura seleccionado no se encuentra registrado.',
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

  async remove(id: number): Promise<SewingThread> {
    try {
      const res = await this.prismaService.sewingThread.delete({
        where: { id },
      });
      if (!res)
        throw new ConflictException(
          'No se encontró el hilo de costura seleccionado.',
        );
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar el hilo seleccionado porque está relacionada con otros registros.',
        );
      }
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
