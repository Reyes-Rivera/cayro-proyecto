import { IsNotEmpty, IsString, MaxLength, MinLength, IsArray, IsOptional, ValidateNested } from "class-validator";
// import { SocialLinks } from "../entities/company-profile.entity";
export class SocialLinks {
    @IsString()
    @IsNotEmpty()
    platform: string;
  
    @IsString()
    @IsNotEmpty()
    url: string;
  }
  
export class CreateCompanyProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  slogan: string;

  @IsArray()
  socialLinks: { platform: string; url: string }[]; 

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(200)
  logoUrl: string;

  @IsArray()
  @IsOptional() // Si es opcional, puedes usar @IsOptional
  contactInfo?: any[]; // Puedes usar cualquier tipo adecuado para este campo, dependiendo de cómo lo manejes
}
