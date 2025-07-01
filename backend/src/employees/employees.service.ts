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
      const employeeFound = await this.prismaService.employee.findFirst({
        where: {
          OR: [
            { email: createEmployeeDto.email },
            { phone: createEmployeeDto.phone },
          ],
        },
      });
      const userFound = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { email: createEmployeeDto.email },
            { phone: createEmployeeDto.phone },
          ],
        },
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
    try {
      const employee = await this.prismaService.employee.findUnique({
        where: { id },
        include: {
          employeeAddresses: {
            include: {
              address: true,
            },
          },
        },
      });

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      return employee;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error fetching employee with ID ${id}: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employeeFound = await this.prismaService.employee.findUnique({
        where: { id },
      });

      if (!employeeFound) {
        throw new NotFoundException(`Empleado no encontrado.`);
      }

      const emailConflict = await this.prismaService.employee.findFirst({
        where: {
          email: updateEmployeeDto.email,
          NOT: { id },
        },
      });

      const userConflict = await this.prismaService.user.findFirst({
        where: {
          email: updateEmployeeDto.email,
        },
      });
      if (userConflict) {
        throw new ConflictException(
          'El correo se encuentra registrado como cliente.',
        );
      }

      if (emailConflict) {
        throw new ConflictException(
          'El correo ya esta en uso por otro empleado.',
        );
      }

      const res = await this.prismaService.employee.update({
        where: { id },
        data: {
          ...updateEmployeeDto,
          birthdate: updateEmployeeDto.birthdate
            ? new Date(updateEmployeeDto.birthdate)
            : employeeFound.birthdate,
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
      // First check if employee exists
      const employee = await this.prismaService.employee.findUnique({
        where: { id },
      });

      if (!employee) {
        throw new NotFoundException('El empleado no existe.');
      }

      await this.prismaService.employeeAddress.deleteMany({
        where: { employeeId: id },
      });

      // Then delete the employee
      const res = await this.prismaService.employee.delete({
        where: { id },
      });

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

  async getEmployeeAddresses(employeeId: number) {
    try {
      const employee = await this.prismaService.employee.findUnique({
        where: { id: employeeId },
        include: {
          employeeAddresses: {
            include: {
              address: true,
            },
          },
        },
      });

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }

      return employee.employeeAddresses.map((ea) => ({
        ...ea.address,
        isDefault: ea.isDefault,
      }));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error fetching addresses for employee ${employeeId}: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDefaultAddress(employeeId: number) {
    try {
      const defaultAddress = await this.prismaService.employeeAddress.findFirst(
        {
          where: {
            employeeId,
            isDefault: true,
          },
          include: {
            address: true,
          },
        },
      );

      if (!defaultAddress) {
        throw new NotFoundException(
          'No default address found for this employee',
        );
      }

      return {
        ...defaultAddress.address,
        isDefault: defaultAddress.isDefault,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error fetching default address for employee ${employeeId}: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addAddress(employeeId: number, addressData: UpdateAddressDto) {
    try {
      // Check if employee exists
      const employee = await this.prismaService.employee.findUnique({
        where: { id: employeeId },
      });

      if (!employee) {
        throw new NotFoundException(`Employee with ID ${employeeId} not found`);
      }

      // Create new address and connect it to the employee
      const newAddress = await this.prismaService.address.create({
        data: {
          ...addressData,
          employeeAddresses: {
            create: {
              employeeId,
              isDefault: false, // New addresses are not default by default
            },
          },
        },
      });

      return newAddress;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error adding address for employee ${employeeId}: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateAddress(
    employeeId: number,
    addressId: number,
    addressData: UpdateAddressDto,
  ) {
    try {
      // Verify the address belongs to the employee
      const employeeAddress =
        await this.prismaService.employeeAddress.findFirst({
          where: {
            employeeId,
            addressId,
          },
        });

      if (!employeeAddress) {
        throw new NotFoundException(
          'Address not found or does not belong to this employee',
        );
      }

      // Update the address
      const updatedAddress = await this.prismaService.address.update({
        where: { id: addressId },
        data: addressData,
      });

      return updatedAddress;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error updating address ${addressId} for employee ${employeeId}: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setDefaultAddress(employeeId: number, addressId: number) {
    try {
      // First reset all addresses to non-default for this employee
      await this.prismaService.employeeAddress.updateMany({
        where: {
          employeeId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });

      // Then set the specified address as default
      const updatedAddress = await this.prismaService.employeeAddress.update({
        where: {
          employeeId_addressId: {
            employeeId,
            addressId,
          },
        },
        data: {
          isDefault: true,
        },
      });

      return updatedAddress;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error setting default address ${addressId} for employee ${employeeId}: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeAddress(employeeId: number, addressId: number) {
    try {
      // First check if this is the last address
      const employeeAddresses =
        await this.prismaService.employeeAddress.findMany({
          where: { employeeId },
        });

      if (employeeAddresses.length <= 1) {
        throw new ConflictException(
          'Cannot delete the only address of an employee',
        );
      }

      // Get the address to check if it's default
      const addressToDelete =
        await this.prismaService.employeeAddress.findUnique({
          where: {
            employeeId_addressId: {
              employeeId,
              addressId,
            },
          },
        });

      if (!addressToDelete) {
        throw new NotFoundException('Address not found for this employee');
      }

      if (addressToDelete.isDefault) {
        const anotherAddress =
          await this.prismaService.employeeAddress.findFirst({
            where: {
              employeeId,
              NOT: { addressId },
            },
          });

        if (anotherAddress) {
          await this.prismaService.employeeAddress.update({
            where: {
              employeeId_addressId: {
                employeeId: anotherAddress.employeeId,
                addressId: anotherAddress.addressId,
              },
            },
            data: {
              isDefault: true,
            },
          });
        }
      }

      await this.prismaService.employeeAddress.delete({
        where: {
          employeeId_addressId: {
            employeeId,
            addressId,
          },
        },
      });

      const otherEmployeeConnections =
        await this.prismaService.employeeAddress.count({
          where: { addressId },
        });

      const userConnections = await this.prismaService.userAddress.count({
        where: { addressId },
      });

      if (otherEmployeeConnections === 0 && userConnections === 0) {
        await this.prismaService.address.delete({
          where: { id: addressId },
        });
      }

      return { message: 'Address removed successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Error removing address ${addressId} for employee ${employeeId}: \nStack: ${error.stack}`,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
