import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsArray,
  IsOptional,
  Matches,
} from "class-validator";

export class CreateCompanyProfileDto {
  @IsString({ message: "El título debe ser de tipo texto." })
  @IsNotEmpty({ message: "El título es requerido." })
  @MinLength(4, { message: "El título debe tener al menos 4 caracteres." })
  @MaxLength(50, { message: "El título no debe superar los 50 caracteres." })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: "El título no puede contener los caracteres '<', '>', '\"' o \"'\".",
  })
  title: string;

  @IsString({ message: "El eslogan debe ser de tipo texto." })
  @IsNotEmpty({ message: "El eslogan es requerido." })
  @MinLength(4, { message: "El eslogan debe tener al menos 4 caracteres." })
  @MaxLength(50, { message: "El eslogan no debe superar los 50 caracteres." })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: "El eslogan no puede contener los caracteres '<', '>', '\"' o \"'\".",
  })
  slogan: string;

  @IsArray({ message: "Los enlaces sociales deben ser un array." })
  socialLinks: { platform: string; url: string }[];

  @IsString({ message: "La URL del logo debe ser de tipo texto." })
  @IsNotEmpty({ message: "La URL del logo es requerida." })
  @MinLength(4, { message: "La URL del logo debe tener al menos 4 caracteres." })
  @MaxLength(200, { message: "La URL del logo no debe superar los 200 caracteres." })
  @Matches(
    /^(https?:\/\/)?([\w\-]+)+[\w\-\._~:/?#[\]@!\$&'()*\+,;=.]+$/,
    { message: "Por favor, ingrese una URL válida para el logo." }
  )
  logoUrl: string;

  @IsString({ message: "La misión debe ser de tipo texto." })
  @IsNotEmpty({ message: "La misión es requerida." })
  @MinLength(4, { message: "La misión debe tener al menos 4 caracteres." })
  @MaxLength(1000, { message: "La misión no debe superar los 1000 caracteres." })
  @Matches(/^(?!.*[<>']).+$/, {
    message: "La misión no puede contener los caracteres '<', '>' o \"'\" (comilla simple).",
  })
  mission: string;

  @IsString({ message: "La visión debe ser de tipo texto." })
  @IsNotEmpty({ message: "La visión es requerida." })
  @MinLength(4, { message: "La visión debe tener al menos 4 caracteres." })
  @MaxLength(1000, { message: "La visión no debe superar los 1000 caracteres." })
  @Matches(/^(?!.*[<>']).+$/, {
    message: "La visión no puede contener los caracteres '<', '>' o \"'\" (comilla simple).",
  })
  vision: string;

  @IsArray({ message: "La información de contacto debe ser un array." })
  @IsOptional()
  contactInfo?: any[];
}
