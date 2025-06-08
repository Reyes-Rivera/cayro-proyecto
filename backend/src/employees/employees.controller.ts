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
import {
  NewPassword,
  PasswordUpdate,
  UpdateEmployeeDto,
  UpdateAddressDto,
} from './dto/update-employee.dto';
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
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Get(':id/addresses')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  findAddresses(@Param('id') id: string) {
    return this.employeesService.getEmployeeAddresses(+id);
  }

  @Get(':id/addresses/default')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  findDefaultAddress(@Param('id') id: string) {
    return this.employeesService.getDefaultAddress(+id);
  }

  @Post(':id/addresses')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  addAddress(@Param('id') id: string, @Body() addressData: UpdateAddressDto) {
    return this.employeesService.addAddress(+id, addressData);
  }

  @Put(':id/addresses/:addressId')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  updateAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Body() addressData: UpdateAddressDto,
  ) {
    return this.employeesService.updateAddress(+id, +addressId, addressData);
  }

  @Patch(':id/addresses/:addressId/default')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  setDefaultAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
  ) {
    return this.employeesService.setDefaultAddress(+id, +addressId);
  }

  @Delete(':id/addresses/:addressId')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
  removeAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
  ) {
    return this.employeesService.removeAddress(+id, +addressId);
  }

  @Patch('change-password/:id')
  @Auth([Role.EMPLOYEE, Role.ADMIN])
  async changePassword(
    @Param('id') id: string,
    @Body() updatePass: PasswordUpdate,
  ) {
    return this.employeesService.updatePassword(+id, updatePass);
  }

  @Patch('update-password/:id')
  @Auth([Role.EMPLOYEE, Role.ADMIN])
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePass: NewPassword,
  ) {
    return this.employeesService.newPassword(+id, updatePass);
  }

  @Patch(':id')
  @Auth([Role.ADMIN, Role.EMPLOYEE])
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
}
