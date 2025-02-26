import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prismaService: PrismaService) {}
  async isPasswordCompromised(password: string): Promise<boolean> {
    const hashedPassword = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();
    const prefix = hashedPassword.slice(0, 5);
    const suffix = hashedPassword.slice(5);
    try {
      const response = await axios.get(
        `https://api.pwnedpasswords.com/range/${prefix}`,
      );
      const breachedPasswords = response.data.split('\n');

      for (let entry of breachedPasswords) {
        const [hashSuffix, count] = entry.split(':');
        if (hashSuffix === suffix) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error verificando contraseña comprometida:', error);
      return false;
    }
  }
  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employeeFound = await this.prismaService.employee.findUnique({
        where: { email: createEmployeeDto.email },
      });
      const userFound = await this.prismaService.user.findUnique({
        where: { email: createEmployeeDto.email },
      });
      if (userFound) {
        throw new ConflictException(
          'El correo se encuentra registrado como cliente.',
        );
      }
      if (employeeFound) {
        throw new ConflictException('El correo ya esta en uso.');
      }
      const compromised = await this.isPasswordCompromised(
        createEmployeeDto.password,
      );

      if (compromised) {
        throw new ConflictException(
          'Esta contraseña ha sido comprometida. Por favor elige una diferente.',
        );
      }
      const hashPassword = await bcrypt.hash(createEmployeeDto.password, 10);

      const res = await this.prismaService.employee.create({
        data: {
          ...createEmployeeDto,
          password: hashPassword,
          birthdate: new Date(createEmployeeDto.birthdate),
          passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          passwordsHistory: [{ password: hashPassword, createdAt: new Date() }],
        },
      });
      const {
        password,
        passwordsHistory,
        passwordExpiresAt,
        passwordSetAt,
        ...rest
      } = res;

      return { ...rest };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all employees`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      console.log(updateEmployeeDto);
      const employeeFound = await this.prismaService.employee.findUnique({
        where: { email: updateEmployeeDto.email },
      });
      const userFound = await this.prismaService.user.findUnique({
        where: { email: updateEmployeeDto.email },
      });
      if (userFound) {
        if (
          userFound.email === updateEmployeeDto.email &&
          userFound.id !== id
        ) {
          throw new ConflictException('El correo se encuentra registrado.');
        }
      }
      if (employeeFound) {
        if (
          employeeFound.email === updateEmployeeDto.email &&
          employeeFound.id !== id
        ) {
          throw new ConflictException('El correo ya esta en uso.');
        }
      }

      const res = await this.prismaService.employee.update({
        where: { id: id },
        data: {
          ...updateEmployeeDto,
          birthdate: new Date(employeeFound.birthdate),
        },
      });
      const {
        password,
        passwordsHistory,
        passwordExpiresAt,
        passwordSetAt,
        ...rest
      } = res;

      return { ...rest };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
