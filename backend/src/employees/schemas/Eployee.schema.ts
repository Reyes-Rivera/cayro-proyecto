// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { Role } from "src/auth/roles/role.enum";
// // import { Direction, Passwords } from "../entities/user.entity";

// @Schema({ timestamps: true })
// export class Employee {
//     @Prop({ required: true, trim: true })
//     name: string;

//     @Prop({ required: true, trim: true })
//     surname: string;

//     @Prop({ required: true, trim: true, unique: true })
//     email: string;

//     @Prop({ required: true, trim: true })
//     phone: string;

//     @Prop({ required: true, trim: true })
//     birthday: Date;

//     @Prop({ required: true, trim: true })
//     password: string;

//     @Prop({ required: true, trim: true, default: Date.now() })
//     passwordSetAt?: Date;

//     @Prop({
//         required: true, trim: true, default: () => {
//             const currentDate = new Date();
//             currentDate.setMonth(currentDate.getMonth() + 3);
//             return currentDate;
//         },
//     })
//     passwordExpiresAt?: Date;

//     @Prop({ trim: true })
//     passwordsHistory?: Passwords[];

//     @Prop({ default: 0 })
//     loginAttempts: number;
    
//     @Prop({ default: null })
//     lockUntil?: Date;

//     @Prop({ trim: true })
//     gender?: string;

//     @Prop({ trim: true })
//     direction?: Direction[];

//     @Prop({ trim: true })
//     active?: boolean;

//     @Prop({trim:true })
//     role?: string;
// }

// export const EmployeeSchema = SchemaFactory.createForClass(Employee);