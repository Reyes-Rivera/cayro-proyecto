import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeDto } from './create-size.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(20)
  name?: string;
}
