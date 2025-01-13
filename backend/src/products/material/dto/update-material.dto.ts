import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialDto } from './create-material.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(200)
  description?: string;
}
