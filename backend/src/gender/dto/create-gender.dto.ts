import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { GenderType } from "../entities/gender.entity";

export class CreateGenderDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    name:GenderType;
}
