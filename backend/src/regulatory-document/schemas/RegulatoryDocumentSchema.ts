import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DocumentTypeInter, Status } from "../entities/enums";

@Schema()
export class DocumentRegulatory {
    @Prop({ required: true, trim: true })
    title: string;
    @Prop({ required: true, trim: true })
    content: string;
    @Prop({  trim: true })
    version?: number;
    @Prop({  trim: true })
    createdAt?: Date;
    @Prop({ trim: true })
    updatedAt?: Date;

    @Prop({ required: true, trim: true })
    effectiveDate: Date;
    @Prop({ trim: true })
    isDeleted?: boolean;
    @Prop({  trim: true })
    isCurrentVersion?: boolean;
    @Prop({ trim: true })
    previousVersionId?: string;
    @Prop({  trim: true })
    status?: Status;
    @Prop({ trim: true })
    type:DocumentTypeInter;
}

export const DocumentRegulatorySchema = SchemaFactory.createForClass(DocumentRegulatory);