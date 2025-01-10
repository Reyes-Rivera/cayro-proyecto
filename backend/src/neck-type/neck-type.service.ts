import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNeckTypeDto } from './dto/create-neck-type.dto';
import { UpdateNeckTypeDto } from './dto/update-neck-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NeckType } from '@prisma/client';

@Injectable()
export class NeckTypeService {
  constructor(private prismaService: PrismaService) {}

  async create(createNeckTypeDto: CreateNeckTypeDto): Promise<NeckType> {
    try {
      const neckTypeFound = await this.prismaService.neckType.findFirst({
        where: { name: createNeckTypeDto.name },
      });
      if (neckTypeFound)
        throw new ConflictException(
          'Este tipo de cuello ya se encuentra registrado.',
        );
      const res = await this.prismaService.neckType.create({
        data: createNeckTypeDto,
      });
      return res;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<NeckType[]> {
    return await this.prismaService.neckType.findMany();
  }

  async findOne(id: number): Promise<NeckType> {
    return await this.prismaService.neckType.findFirst({ where: { id } });
  }

  async update(id: number, updateNeckTypeDto: UpdateNeckTypeDto) {
    try {
      const neckTypeFound = await this.prismaService.neckType.findFirst({
        where: { name: updateNeckTypeDto.name },
      });
      if (neckTypeFound)
        throw new ConflictException(
          'Este tipo de cuello ya se encuentra registrado.',
        );
      const res = await this.prismaService.neckType.update({
        where: { id },
        data: this.update,
      });
      if (!res)
        throw new NotFoundException(
          'Este tipo de cuello no se encuentra registrado.',
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
      const res = await this.prismaService.neckType.delete({
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
          'No se puede eliminar el tipo de cuello porque está relacionado con otros registros.',
        );
      throw new InternalServerErrorException('Error interno en el servidor.');
    }
  }
}
