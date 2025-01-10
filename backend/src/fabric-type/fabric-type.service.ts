import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFabricTypeDto } from './dto/create-fabric-type.dto';
import { UpdateFabricTypeDto } from './dto/update-fabric-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FabricType } from '@prisma/client';

@Injectable()
export class FabricTypeService {
  constructor(private prismaService: PrismaService) {}
  async create(createFabricTypeDto: CreateFabricTypeDto): Promise<FabricType> {
    try {
      const res = await this.prismaService.fabricType.findFirst({
        where: {
          name: createFabricTypeDto.name,
        },
      });
      if (res)
        throw new ConflictException('Este tipo de tela ya está registrado.');
      return await this.prismaService.fabricType.create({
        data: createFabricTypeDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<FabricType[]> {
    return await this.prismaService.fabricType.findMany();
  }

  async findOne(id: number): Promise<FabricType> {
    return await this.prismaService.fabricType.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateFabricTypeDto: UpdateFabricTypeDto) {
    try {
      const fabricTypeFound = await this.prismaService.fabricType.findFirst({
        where: { name: updateFabricTypeDto.name },
      });
      if (fabricTypeFound)
        throw new ConflictException('Este tipo de tela ya está registrado.');
      const res = await this.prismaService.fabricType.update({
        where: { id },
        data: updateFabricTypeDto,
      });
      if (!res)
        throw new NotFoundException(
          'No se encontró el tipo de tela seleccionado.',
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

  async remove(id: number) {
    try {
      const res = await this.prismaService.fabricType.delete({
        where: { id },
      });
      if (!res)
        throw new NotFoundException(
          'No se encontró el tipo de tela seleccionado.',
        );
      return res;
    } catch (error) {
      if (error.code === 'P2003')
        throw new ConflictException(
          'No se puede eliminar la tela porque está relacionado con otros registros.',
        );
      throw new InternalServerErrorException('Error interno en el servidor.');
    }
  }
}
