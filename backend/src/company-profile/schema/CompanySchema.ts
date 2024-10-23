import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Audit, ContactInfo, SocialLinks } from "../entities/company-profile.entity";

// SocialLinks Schema
@Schema()
export class SocialLinksSchema extends Document {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  url: string;
}

export const SocialLinksSchemaFactory = SchemaFactory.createForClass(SocialLinksSchema);

// Audit Schema
@Schema()
export class AuditSchema extends Document {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  adminId: string;

  @Prop({ required: true })
  date: Date;
}

export const AuditSchemaFactory = SchemaFactory.createForClass(AuditSchema);

// CompanyProfile Schema
@Schema({ timestamps: true })
export class CompanyProfile extends Document {  // Asegúrate de que extiende Document
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  slogan: string;

  @Prop({ required: true, type: [SocialLinksSchema] })  // Usar el schema para los subdocumentos
  socialLinks: SocialLinks[]; 

  @Prop({ required: true, trim: true })
  logoUrl: string;

  @Prop({ required: true, type: Object })  // No hay necesidad de crear un esquema separado para objetos simples
  contactInfo: ContactInfo; 

  @Prop({ required: true, type: [AuditSchema] })  // Usar el schema para los subdocumentos
  auditLog: Audit[];
}

export const CompanyProfileSchema = SchemaFactory.createForClass(CompanyProfile);
