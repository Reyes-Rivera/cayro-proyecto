import { IsString, IsNumber, IsOptional, Min, Max, MinLength, MaxLength, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmailDataDto } from './create-configuration.dto'; 

export class UpdateConfigurationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  timeTokenLogin?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  timeTokenEmail?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  attemptsLogin?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EmailDataDto)
  emailVerificationInfo?: EmailDataDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EmailDataDto)
  emailLogin?: EmailDataDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EmailDataDto)
  emailResetPass?: EmailDataDto;
}
