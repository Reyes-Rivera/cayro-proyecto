import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateColorDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    name:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @MinLength(7)
    hexValue:string
}
