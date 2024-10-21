import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "src/auth/roles/role.enum";
import { Audit, ContactInfo, SocialLinks } from "../entities/company-profile.entity";
import { Document } from "mongoose";

@Schema()
export class SocialLinksSchema extends Document {
  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;
}

@Schema()
export class AuditSchema extends Document {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  adminId: string;

  @Prop({ required: true })
  date: Date;
}

@Schema({ timestamps: true })
export class CompanyProfile {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, trim: true })
    slogan: string;

    @Prop({ required: true, type: [SocialLinksSchema] })
    socialLinks: SocialLinks[]; 

    @Prop({ required: true, trim: true })
    logoUrl: string;

    @Prop({ required: true, type: Object })
    contactInfo: ContactInfo; 

    @Prop({ required: true, type: [AuditSchema] })
    auditLog: Audit[];
}

export const CompanyProfileSchema = SchemaFactory.createForClass(CompanyProfile);
