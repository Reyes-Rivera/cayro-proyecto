import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Brand } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(private prismaService: PrismaService) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      const brandFound = await this.prismaService.brand.findFirst({
        where: { name: createBrandDto.name },
      });
      if (brandFound)
        throw new ConflictException('Esta marca ya se encuentra registrada.');
      return await this.prismaService.brand.create({ data: createBrandDto });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Brand[]> {
    return await this.prismaService.brand.findMany();
  }

  async findOne(id: number): Promise<Brand> {
    return await this.prismaService.brand.findUnique({ where: { id } });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    try {
      const brandFound = await this.prismaService.brand.findUnique({
        where: { name: updateBrandDto.name },
      });
      if (brandFound)
        throw new ConflictException('Esta marca ya se encuentra registrada.');
      return await this.prismaService.brand.update({
        where: { id },
        data: updateBrandDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<Brand> {
    try {
      const deleteBrand = await this.prismaService.brand.delete({
        where: { id },
      });
      if (!deleteBrand) throw new NotFoundException('No se encontró la marca.');
      return deleteBrand;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error.code === 'P2003')
        throw new ConflictException(
          'No se puede eliminar la marca porque tiene productos asociados.',
        );
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
