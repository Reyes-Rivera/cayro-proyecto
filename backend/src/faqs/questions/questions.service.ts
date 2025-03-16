import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FAQ } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppLogger } from 'src/utils/logger.service';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: AppLogger,
  ) {}
  async create(createQuestionDto: CreateQuestionDto): Promise<FAQ> {
    try {
      const foundFaq = await this.prismaService.fAQ.findFirst({
        where: {
          OR: [
            { question: createQuestionDto.question },
            { answer: createQuestionDto.answer },
          ],
        },
      });
      if (foundFaq)
        throw new ConflictException('La pregunta ya se encuentra registrada.');
      return await this.prismaService.fAQ.create({
        data: createQuestionDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error interno en el servidor.', error.stack);
      throw new HttpException(
        'Error interno en el servidfor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<FAQ[]> {
    try {
      return await this.prismaService.fAQ.findMany();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Error al obtener las preguntas frecuentes.',
        error.stack,
      );
      throw new HttpException(
        'Error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<FAQ> {
    try {
      const foundFaq = await this.prismaService.fAQ.findFirst({
        where: {
          AND: [
            { question: updateQuestionDto.question },
            { answer: updateQuestionDto.answer },
          ],
        },
      });
      if (foundFaq)
        throw new ConflictException('La pregunta ya se encuentra registrada.');
      return await this.prismaService.fAQ.update({
        where: { id },
        data: updateQuestionDto,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Error al actualizar la pregunta frecuente.',
        error.stack,
      );
      throw new HttpException(
        'Error interno en el servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<FAQ> {
    try {
      const res = await this.prismaService.fAQ.delete({
        where: { id },
      });
      if (!res)
        throw new ConflictException('No se encontró la pregunta seleccionada.');
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al eliminar la pregunta frecuente', error.stack);
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
