import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gender } from '@prisma/client';

@Injectable()
export class GenderService {
  constructor(private prismaService: PrismaService) {}
  async create(createGenderDto: CreateGenderDto): Promise<Gender> {
    try {
      const genderFound = await this.prismaService.gender.findFirst({
        where: { name: createGenderDto.name },
      });
      if (genderFound)
        throw new ConflictException('El genero ya se encuentra registrado.');
      return await this.prismaService.gender.create({ data: createGenderDto });
    } catch (error) {
      if (error instanceof HttpException) throw Error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Gender[]> {
    return await this.prismaService.gender.findMany();
  }

  async findOne(id: number): Promise<Gender> {
    return await this.prismaService.gender.findFirst({
      where: { id },
    });
  }

  async update(id: number, updateGenderDto: UpdateGenderDto) {
    try {
      const foundGender = await this.prismaService.gender.findFirst({
        where: { name: updateGenderDto.name },
      });
      if (foundGender)
        throw new ConflictException('Este género ya se encuentra registrado.');
      return await this.prismaService.gender.update({
        where: { id },
        data: updateGenderDto,
      });
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
      return await this.prismaService.gender.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
