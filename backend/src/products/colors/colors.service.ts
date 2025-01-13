import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Color } from '@prisma/client';

@Injectable()
export class ColorsService {
  constructor(private prismaService: PrismaService) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    try {
      const [foundName, foundHexValue] = await Promise.all([
        this.prismaService.color.findUnique({
          where: { name: createColorDto.name },
        }),
        this.prismaService.color.findUnique({
          where: { hexValue: createColorDto.hexValue },
        }),
      ]);

      if (foundName) {
        throw new ConflictException('El nombre del color ya está en uso.');
      }

      if (foundHexValue) {
        throw new ConflictException('El valor del hexadecimal ya está en uso.');
      }

      return await this.prismaService.color.create({ data: createColorDto });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Color[]> {
    return await this.prismaService.color.findMany();
  }

  async findOne(id: number): Promise<Color> {
    return await this.prismaService.color.findUnique({ where: { id } });
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    try {
      const [nameFound, hexValueFound] = await Promise.all([
        this.prismaService.color.findMany({
          where: { name: updateColorDto.name },
        }),
        this.prismaService.color.findMany({
          where: { hexValue: updateColorDto.hexValue },
        }),
      ]);
      if (nameFound)
        throw new ConflictException('El color ya esta registrado.');
      if (hexValueFound)
        throw new ConflictException('El hexadecimal ya esta registrado.');

      return await this.prismaService.color.update({
        where: { id },
        data: updateColorDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<Color | null> {
    try {
      return await this.prismaService.color.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar el color porque está relacionado con otros registros.',
        );
      }
      throw new InternalServerErrorException('Error interno en el servidor.');
    }
  }
}
