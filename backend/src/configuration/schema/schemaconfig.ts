import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class EmailData {
  @Prop({ required: true, trim: true, minlength: 5, maxlength: 50 })
  title: string;

  @Prop({ required: true, trim: true, minlength: 4, maxlength: 50 })
  greeting: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 200 })
  maininstruction: string;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 200 })
  secondaryinstruction: string;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 100 })
  expirationtime: string;

  @Prop({ required: true, trim: true, minlength: 5, maxlength: 200 })
  finalMessage: string;

  @Prop({ required: true, trim: true, minlength: 3, maxlength: 100 })
  signature: string;
}

export const EmailDataSchema = SchemaFactory.createForClass(EmailData);

// Esquema para Configuration
@Schema({ timestamps: true })
export class Configuration extends Document {
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 10 })
  timeTokenLogin: string;

  @Prop({ required: true, trim: true, minlength: 1, maxlength: 10 })
  timeTokenEmail: string;

  @Prop({ required: true })
  attemptsLogin: number;

  @Prop({ type: EmailDataSchema, required: true })
  emailVerificationInfo: EmailData;

  @Prop({ type: EmailDataSchema, required: true })
  emailLogin: EmailData;

  @Prop({ type: EmailDataSchema, required: true })
  emailResetPass: EmailData;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
