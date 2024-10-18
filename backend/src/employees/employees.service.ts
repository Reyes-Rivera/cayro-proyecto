import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schemas/Eployee.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import axios from 'axios';
import { User } from 'src/users/schemas/User.Schema';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(User.name) private userModel: Model<User>,


  ) {

  }
  async isPasswordCompromised(password: string): Promise<boolean> {
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hashedPassword.slice(0, 5);
    const suffix = hashedPassword.slice(5);
    try {
      const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
      const breachedPasswords = response.data.split('\n');

      for (let entry of breachedPasswords) {
        const [hashSuffix, count] = entry.split(':');
        if (hashSuffix === suffix) {
          return true; // Contraseña comprometida
        }
      }
      return false; // Contraseña segura
    } catch (error) {
      console.error('Error verificando contraseña comprometida:', error);
      return false; // Por precaución, devolver que no está comprometida en caso de error
    }
  }
  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employeeFound = await this.employeeModel.findOne({ email: createEmployeeDto.email });
      const userFound = await this.userModel.findOne({ email: createEmployeeDto.email });
      if (userFound) {
        throw new ConflictException("El correo se encuentra registrado como cliente.");
      }
      if (employeeFound) {
        throw new ConflictException("El correo ya esta en uso.");
      }
      const compromised = await this.isPasswordCompromised(createEmployeeDto.password);

      if (compromised) {
        throw new ConflictException("Esta contraseña ha sido comprometida. Por favor elige una diferente.");
      }
      const hashPassword = await bcrypt.hash(createEmployeeDto.password, 10);

      const res = new this.employeeModel({ ...createEmployeeDto, password: hashPassword });
      res.passwordsHistory.push({ password: hashPassword, createdAt: new Date() });
      await res.save();
      return res;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
