import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { NewPassword, PasswordUpdate, UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Auth([Role.ADMIN])
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Auth([Role.ADMIN])
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @Auth([Role.ADMIN,Role.EMPLOYEE])
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Get('address/:id')
  @Auth([Role.ADMIN,Role.EMPLOYEE])
  findOneAddress(@Param('id') id: string) {
    try {
      const res = this.employeesService.findOneAddress(+id);
      if (!res) throw new NotFoundException('No se encontraron direcciones.');
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  @Auth([Role.EMPLOYEE, Role.ADMIN])
  @Patch('change-password/:id')
  async changePassword(
    @Param('id') id: number,
    @Body() updatePass: PasswordUpdate,
  ) {
    return this.employeesService.updatePassword(Number(id), updatePass);
  }

  @Auth([Role.EMPLOYEE, Role.ADMIN])
  @Patch('update-password/:id')
  async updatePassword(
    @Param('id') id: number,
    @Body() updatePass: NewPassword,
  ) {
    return this.employeesService.newPassword(Number(id), updatePass);
  }

  @Patch(':id')
  @Auth([Role.ADMIN,Role.EMPLOYEE])
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @Auth([Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
  @Put(':userId')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  async upsertUserAddress(
    @Param('userId') userId: number,
    @Body()
    addressData: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      colony: string;
    },
  ) {
    return this.employeesService.upsertEmployeeAddress(+userId, addressData);
  }
}
