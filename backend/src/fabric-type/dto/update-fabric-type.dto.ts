import { PartialType } from '@nestjs/mapped-types';
import { CreateFabricTypeDto } from './create-fabric-type.dto';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateFabricTypeDto extends PartialType(CreateFabricTypeDto) {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(200)
  description: string;
}
