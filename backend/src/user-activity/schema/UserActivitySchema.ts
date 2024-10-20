import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class UserActivity {
    @Prop({ required: true, trim: true })
    email: string;

    @Prop({ trim: true})
    action?: string;

    @Prop({trim: true, default: Date.now() })
    date?: Date;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);