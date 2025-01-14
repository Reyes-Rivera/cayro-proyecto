import { PartialType } from '@nestjs/mapped-types';
import { CreateSewingThreadDto } from './create-sewing-thread.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSewingThreadDto extends PartialType(CreateSewingThreadDto) {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(100)
  name?: string;
}
