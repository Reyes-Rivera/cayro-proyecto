import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaqCategoryService } from './faq_category.service';
import { CreateFaqCategoryDto } from './dto/create-faq_category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq_category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('faq-category')
export class FaqCategoryController {
  constructor(private readonly faqCategoryService: FaqCategoryService) {}
  @Post()
  @Auth([Role.ADMIN])
  create(@Body() createFaqCategoryDto: CreateFaqCategoryDto) {
    return this.faqCategoryService.create(createFaqCategoryDto);
  }

  @Get()
  findAll() {
    return this.faqCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqCategoryService.findOne(+id);
  }
  @Auth([Role.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFaqCategoryDto: UpdateFaqCategoryDto,
  ) {
    return this.faqCategoryService.update(+id, updateFaqCategoryDto);
  }
  @Auth([Role.ADMIN])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqCategoryService.remove(+id);
  }
}
