import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserActivityDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(10)
    email:string;
    @IsString()
    @IsOptional()
    @MinLength(5)
    @MaxLength(10)
    action?:string;
    @IsOptional()
    @IsDate()
    date?:Date;
}
