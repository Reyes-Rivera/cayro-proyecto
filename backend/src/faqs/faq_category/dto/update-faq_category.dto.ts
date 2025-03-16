import { PartialType } from '@nestjs/mapped-types';
import { CreateFaqCategoryDto } from './create-faq_category.dto';

export class UpdateFaqCategoryDto extends PartialType(CreateFaqCategoryDto) {}
