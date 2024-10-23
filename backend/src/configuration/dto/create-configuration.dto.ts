import { IsString, IsNumber, ValidateNested, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailDataDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  greeting: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  maininstruction: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  secondaryinstruction: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  expirationtime: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  finalMessage: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  signature: string;
}


// Ahora el DTO para Configuration
export class CreateConfigurationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10)
  timeTokenLogin: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10)
  timeTokenEmail: string;

  @IsNumber()
  @IsNotEmpty()
  attemptsLogin: number;

  @ValidateNested()
  @Type(() => EmailDataDto) 
  emailVerificationInfo: EmailDataDto;

  @ValidateNested()
  @Type(() => EmailDataDto)
  emailLogin: EmailDataDto;

  @ValidateNested()
  @Type(() => EmailDataDto)
  emailResetPass: EmailDataDto;
}
