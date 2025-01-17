import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(200)
  description: string;
}
