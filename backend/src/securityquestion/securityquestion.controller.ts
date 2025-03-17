import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SecurityquestionService } from './securityquestion.service';
import { CreateSecurityquestionDto } from './dto/create-securityquestion.dto';
import { UpdateSecurityquestionDto } from './dto/update-securityquestion.dto';

@Controller('securityquestion')
export class SecurityquestionController {
  constructor(private readonly securityquestionService: SecurityquestionService) {}

  @Post()
  create(@Body() createSecurityquestionDto: CreateSecurityquestionDto) {
    return this.securityquestionService.create(createSecurityquestionDto);
  }

  @Get()
  findAll() {
    return this.securityquestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.securityquestionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSecurityquestionDto: UpdateSecurityquestionDto) {
    return this.securityquestionService.update(+id, updateSecurityquestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.securityquestionService.remove(+id);
  }
}
