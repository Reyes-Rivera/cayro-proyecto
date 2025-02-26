import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsString, MaxLength, MinLength, IsEnum } from "class-validator";
import { Genders, Role } from "../entities/employee.entity";

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    surname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(50)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    phone: string;

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value)) 
    birthdate: Date;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    gender: Genders;

    @IsNotEmpty()
    @IsEnum(Role)  
    role: Role;  
}
