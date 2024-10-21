import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Audit, ContactInfo, SocialLinks } from "../entities/company-profile.entity";

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
    socialLinks: SocialLinks[];
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(200)
    logoUrl: string;
    contactInfo: ContactInfo
    auditLog: Audit[];
}
