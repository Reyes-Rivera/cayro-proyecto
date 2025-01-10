import { PartialType } from '@nestjs/mapped-types';
import { CreateNeckTypeDto } from './create-neck-type.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateNeckTypeDto extends PartialType(CreateNeckTypeDto) {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name?: string;
}
