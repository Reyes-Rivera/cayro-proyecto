import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSewingThreadDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  name: string;
}
