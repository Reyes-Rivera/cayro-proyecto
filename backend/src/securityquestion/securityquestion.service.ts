import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateSecurityQuestionDto } from './dto/create-securityquestion.dto';
import { UpdateSecurityquestionDto } from './dto/update-securityquestion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppLogger } from 'src/utils/logger.service';

@Injectable()
export class SecurityquestionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async create(createSecurityquestionDto: CreateSecurityQuestionDto) {
    try {
      const existingQuestion =
        await this.prismaService.securityQuestion.findUnique({
          where: { question: createSecurityquestionDto.question },
        });

      if (existingQuestion) {
        throw new ConflictException('Esta pregunta de seguridad ya existe.');
      }

      return await this.prismaService.securityQuestion.create({
        data: { question: createSecurityquestionDto.question },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error al crear una pregunta secreta.', error.stack);
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return await this.prismaService.securityQuestion.findMany();
  }

  async findOne(id: number) {
    const question = await this.prismaService.securityQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException(`No se encontró la pregunta con ID ${id}.`);
    }

    return question;
  }

  async update(
    id: number,
    updateSecurityquestionDto: UpdateSecurityquestionDto,
  ) {
    try {
      const question = await this.prismaService.securityQuestion.findUnique({
        where: { id },
      });

      if (!question) {
        throw new NotFoundException(`No se encontró la pregunta con ID ${id}.`);
      }

      const existingQuestion =
        await this.prismaService.securityQuestion.findUnique({
          where: { question: updateSecurityquestionDto.question },
        });

      if (existingQuestion && existingQuestion.id !== id) {
        throw new ConflictException(
          'Ya existe una pregunta con este mismo texto.',
        );
      }

      return await this.prismaService.securityQuestion.update({
        where: { id },
        data: { question: updateSecurityquestionDto.question },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        'Error al actualizar una pregunta secreta.',
        error.stack,
      );
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const question = await this.prismaService.securityQuestion.findUnique({
        where: { id },
      });

      if (!question) {
        throw new NotFoundException(`No se encontró la pregunta con ID ${id}.`);
      }

      await this.prismaService.securityQuestion.delete({ where: { id } });

      return { message: `Pregunta con ID ${id} eliminada correctamente.` };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'No se puede eliminar esta pregunta porque está relacionada con un usuario.',
        );
      }
      if (error instanceof HttpException) throw error;
      this.logger.error('Error al crear una pregunta secreta.', error.stack);
      throw new HttpException(
        'Error interno en el servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
