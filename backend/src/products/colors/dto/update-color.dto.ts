import { PartialType } from '@nestjs/mapped-types';
import { CreateColorDto } from './create-color.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateColorDto extends PartialType(CreateColorDto) {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(7)
  hexValue?: string;
}
