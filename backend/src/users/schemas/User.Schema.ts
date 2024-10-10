import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Direction } from "../entities/user.entity";

@Schema({timestamps: true})
export class User{
    @Prop({required: true,trim: true})
    name:string;

    @Prop({required: true,trim: true})
    surname: string;

    @Prop({required: true,trim: true,unique: true})
    email: string;

    @Prop({required: true,trim: true})
    phone: string;

    @Prop({required: true,trim: true})
    birthday: Date;

    @Prop({required: true,trim: true})
    password: string;

    @Prop({trim: true})
    gender?: string;

    @Prop({trim: true})
    direction?: Direction[];

    @Prop({trim: true})
    active?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);