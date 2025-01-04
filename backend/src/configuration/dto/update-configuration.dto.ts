import { IsString, IsNumber, IsOptional, Min, Max, MinLength, MaxLength, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmailDataDto } from './create-configuration.dto'; 

export class UpdateConfigurationDto {
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10)
    timeTokenLogin?: number;
  
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10)
    timeTokenEmail?: number;
  
    @IsNumber()
    @IsOptional()
    @Min(3)
    @Max(10)
    attemptsLogin?: number;
  
    @ValidateNested()
    @IsOptional()
    @Type(() => EmailDataDto) 
    emailVerificationInfo?: EmailDataDto[];
  
    @ValidateNested()
    @IsOptional()
    @Type(() => EmailDataDto)
    emailLogin?: EmailDataDto[];
  
    @ValidateNested()
    @IsOptional()
    @Type(() => EmailDataDto)
    emailResetPass?: EmailDataDto[];
}
