import { PartialType } from '@nestjs/mapped-types';
import { CreateGenderDto } from './create-gender.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateGenderDto extends PartialType(CreateGenderDto) {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  name?: string;
}
