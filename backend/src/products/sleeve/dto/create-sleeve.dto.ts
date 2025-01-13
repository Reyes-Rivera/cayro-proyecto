import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSleeveDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  name: string;
}
