import { IsNotEmpty, IsString, Matches, MinLength, MaxLength } from "class-validator";

export class LoginDto {
    @IsString({ message: "El correo electrónico debe ser un texto válido." })
    @IsNotEmpty({ message: "El correo electrónico es requerido." })
    @Matches(/^(?!.*[<>])^\S+@\S+\.\S+$/, {
        message: "Por favor, ingrese un correo electrónico válido.",
    })
    email: string;

    @IsString({ message: "La contraseña debe ser de tipo texto." })
    @IsNotEmpty({ message: "La contraseña es requerida." })
    @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    @MaxLength(50, { message: "La contraseña no debe superar los 50 caracteres." })
    @Matches(/^(?!.*[<>"']).+$/, {
        message: "Caracteres no validos.",
    })
    password: string;
}
