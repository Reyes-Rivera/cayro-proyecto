import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  // @Auth([Role.ADMIN])
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Get('address/:id')
  findOneAddress(@Param('id') id: string) {
    try {
      const res = this.employeesService.findOneAddress(+id);
      if(!res) throw new NotFoundException("No se encontraron direcciones.");
      return res;
    } catch (error) {
      console.log(error);
    }
    
  }

  @Patch(':id')
  // @Auth([Role.ADMIN])
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return await this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
  @Put(':userId')
  @Auth([Role.ADMIN,Role.EMPLOYEE])
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
