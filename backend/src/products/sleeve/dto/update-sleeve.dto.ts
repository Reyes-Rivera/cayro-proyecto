import { PartialType } from '@nestjs/mapped-types';
import { CreateSleeveDto } from './create-sleeve.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSleeveDto extends PartialType(CreateSleeveDto) {
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(100)
  name?: string;
}
