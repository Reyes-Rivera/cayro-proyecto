import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsString({ message: 'El campo de identificación debe ser un texto válido.' })
  @IsNotEmpty({ message: 'El correo electrónico o teléfono es requerido.' })
  @Matches(/^(?!.*[<>])(?:^\S+@\S+\.\S+$|\+\d{1,3}\d{7,15}|\d{7,15})$/, {
    message:
      'Por favor, ingrese un correo electrónico o número de teléfono válido.',
  })
  identifier: string; // Cambiamos de 'email' a 'identifier'

  @IsString({ message: 'La contraseña debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(50, {
    message: 'La contraseña no debe superar los 50 caracteres.',
  })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: 'Caracteres no válidos.',
  })
  password: string;
}
