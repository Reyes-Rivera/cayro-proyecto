import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import {
  NewPassword,
  PasswordUpdate,
  UpdateAddressDto,
  UpdateEmployeeDto,
} from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppLogger } from 'src/utils/logger.service';
type PasswordHistoryEntry = {
  password: string;
  createdAt: string;
};
@Injectable()
export class EmployeesService {
  constructor(
    private prismaService: PrismaService,
    private readonly logger: AppLogger,
  ) {}
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
      this.logger.error(
        `Error verificando contraseña comprometida.: \nStack: ${error.stack}`,
      );
      throw new InternalServerErrorException(
        'Error verificando contraseña comprometida.',
      );
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
      this.logger.error(`Error al crear un empleado: \nStack: ${error.stack}`);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    return this.prismaService.employee.findMany();
  }

  async findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
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
      this.logger.error(
        `Error al actualizar un empleado: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const res = await this.prismaService.employee.delete({ where: { id } });
      if (!res) throw new NotFoundException('El empleado no existe.');
      return res;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        `Error al eliminar un empleado: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOneAddress(id: number) {
    return await this.prismaService.address.findFirst({
      where: {
        employees: {
          some: { id: id },
        },
      },
    });
  }

  async upsertEmployeeAddress(
    employeeId: number,
    addressData: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      colony: string;
    },
  ) {
    try {
      // 📌 Verifica si el empleado realmente existe en la base de datos
      const employeeExists = await this.prismaService.employee.findUnique({
        where: { id: employeeId },
      });
      console.log(employeeExists);
      if (!employeeExists) {
        throw new Error(`El empleado con ID ${employeeId} no existe.`);
      }

      // 📌 Busca si el empleado ya tiene una dirección
      const existingAddress = await this.prismaService.address.findFirst({
        where: {
          employees: {
            some: { id: employeeId },
          },
        },
      });

      if (existingAddress) {
        // 📌 Si ya tiene una dirección, la actualizamos
        const updatedAddress = await this.prismaService.address.update({
          where: { id: existingAddress.id },
          data: { ...addressData },
        });
        return {
          message: 'Dirección del empleado actualizada exitosamente.',
          updatedAddress,
        };
      } else {
        // 📌 Si no tiene dirección, la creamos y conectamos al empleado
        const newAddress = await this.prismaService.address.create({
          data: {
            ...addressData,
            employees: {
              connect: { id: employeeId }, // Se conecta con el empleado en la tabla intermedia
            },
          },
        });
        return {
          message: 'Nueva dirección del empleado creada exitosamente.',
          newAddress,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error al actualizar/crear la dirección: \nStack: ${error.stack}`,
      );
      console.error('Error al actualizar/crear la dirección:', error);
      throw new Error('No se pudo procesar la dirección.');
    }
  }
  async updatePassword(id: number, updatePasswordDto: PasswordUpdate) {
    try {
      const userFound = await this.prismaService.employee.findUnique({
        where: { id },
      });

      if (!userFound) {
        throw new NotFoundException('El usuario no se encuentra registrado.');
      }

      const compromised = await this.isPasswordCompromised(
        updatePasswordDto.password,
      );
      if (compromised) {
        throw new ConflictException(
          'Esta contraseña ha sido comprometida. Por favor elige una diferente.',
        );
      }

      const isMatch = bcrypt.compareSync(
        updatePasswordDto.currentPassword,
        userFound.password,
      );
      if (!isMatch) {
        throw new ConflictException(
          'La contraseña actual es incorrecta, por favor intenta de nuevo.',
        );
      }

      const isInHistory = (
        userFound.passwordsHistory as PasswordHistoryEntry[]
      ).some((entry) =>
        bcrypt.compareSync(updatePasswordDto.password, entry.password),
      );
      if (isInHistory) {
        throw new ConflictException(
          'No puedes reutilizar contraseñas anteriores.',
        );
      }

      const hashPassword = await bcrypt.hash(updatePasswordDto.password, 10);

      const currentDate = new Date();
      const newPasswordExpiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      );

      const passwordHistory = (userFound.passwordsHistory ||
        []) as PasswordHistoryEntry[];
      passwordHistory.push({
        password: hashPassword,
        createdAt: currentDate.toISOString(),
      });

      if (passwordHistory.length > 5) {
        passwordHistory.shift();
      }

      const resUser = await this.prismaService.employee.update({
        where: { id },
        data: {
          password: hashPassword,
          passwordSetAt: currentDate,
          passwordExpiresAt: newPasswordExpiresAt,
          passwordsHistory: passwordHistory,
        },
      });

      await this.prismaService.userActivity.create({
        data: {
          email: userFound.email,
          action: 'Cambio de contraseña.',
          date: new Date(),
        },
      });
      const {
        password,
        passwordsHistory,
        passwordExpiresAt,
        passwordSetAt,
        ...rest
      } = resUser;

      return { ...rest };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async newPassword(id: number, updatePasswordDto: NewPassword) {
    try {
      const userFound = await this.prismaService.employee.findUnique({
        where: { id },
      });

      if (!userFound) {
        throw new NotFoundException('El usuario no se encuentra registrado.');
      }

      const compromised = await this.isPasswordCompromised(
        updatePasswordDto.password,
      );
      if (compromised) {
        throw new ConflictException(
          'Esta contraseña ha sido comprometida. Por favor elige una diferente.',
        );
      }

      const isInHistory = (
        userFound.passwordsHistory as PasswordHistoryEntry[]
      ).some((entry) =>
        bcrypt.compareSync(updatePasswordDto.password, entry.password),
      );
      if (isInHistory) {
        throw new ConflictException(
          'No puedes reutilizar contraseñas anteriores.',
        );
      }

      const hashPassword = await bcrypt.hash(updatePasswordDto.password, 10);

      const currentDate = new Date();
      const newPasswordExpiresAt = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      );

      const passwordHistory = (userFound.passwordsHistory ||
        []) as PasswordHistoryEntry[];
      passwordHistory.push({
        password: hashPassword,
        createdAt: currentDate.toISOString(),
      });

      if (passwordHistory.length > 5) {
        passwordHistory.shift();
      }

      const resUser = await this.prismaService.employee.update({
        where: { id },
        data: {
          password: hashPassword,
          passwordSetAt: currentDate,
          passwordExpiresAt: newPasswordExpiresAt,
          passwordsHistory: passwordHistory,
        },
      });

      await this.prismaService.userActivity.create({
        data: {
          email: userFound.email,
          action: 'Cambio de contraseña.',
          date: new Date(),
        },
      });
      const {
        password,
        passwordsHistory,
        passwordExpiresAt,
        passwordSetAt,
        ...rest
      } = resUser;

      return { ...rest };
    } catch (error) {
      console.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
