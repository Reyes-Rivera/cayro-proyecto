import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
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
    birthday: Date;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    password: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;
}
