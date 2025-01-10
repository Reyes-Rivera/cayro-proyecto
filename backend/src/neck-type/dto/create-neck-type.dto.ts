import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNeckTypeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;
}
