import { IsNotEmpty, IsString, MaxLength, MinLength, IsArray, IsOptional, ValidateNested } from "class-validator";
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

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(1000)
  mission:string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(500)
  vision:string;

  @IsArray()
  @IsOptional() 
  contactInfo?: any[];
}
