import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { SecurityquestionService } from './securityquestion.service';
import { CreateSecurityQuestionDto } from './dto/create-securityquestion.dto';
import { UpdateSecurityquestionDto } from './dto/update-securityquestion.dto';

@Controller('securityquestion')
export class SecurityquestionController {
  constructor(private readonly securityquestionService: SecurityquestionService) {}

  @Post()
  async create(@Body() createSecurityquestionDto: CreateSecurityQuestionDto) {
    try {
      return await this.securityquestionService.create(createSecurityquestionDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.securityquestionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.securityquestionService.findOne(+id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSecurityquestionDto: UpdateSecurityquestionDto) {
    try {
      return await this.securityquestionService.update(+id, updateSecurityquestionDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.securityquestionService.remove(+id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
