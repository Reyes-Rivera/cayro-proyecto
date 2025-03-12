import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';
import { Genders } from 'src/employees/entities/employee.entity';

export class CreateUserDto {
  @IsString({ message: 'Solo se permiten caracteres de tipo texto.' })
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'Por favor, ingrese solo letras (mayúsculas o minúsculas), espacios y caracteres acentuados.',
  })
  name: string;

  @IsString({ message: 'Solo se permiten caracteres de tipo texto.' })
  @IsNotEmpty({ message: 'El apellido es requerido.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
  @MaxLength(50, { message: 'El apellido no debe superar los 50 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'Por favor, ingrese solo letras (mayúsculas o minúsculas), espacios y caracteres acentuados.',
  })
  surname: string;

  @IsString({ message: 'El correo electrónico debe ser un texto válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @IsEmail({}, { message: 'Por favor, ingrese un correo electrónico válido.' })
  @MinLength(10, { message: 'El correo debe tener al menos 10 caracteres.' })
  @MaxLength(50, { message: 'El correo no debe superar los 50 caracteres.' })
  @Matches(/^(?!.*[<>])^\S+@\S+\.\S+$/, {
    message: 'El correo electrónico no debe contener los caracteres "<" o ">", ni espacios.',
  })
  email: string;

  @IsString({ message: 'El número de teléfono debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'El número de teléfono es requerido.' })
  @MinLength(10, { message: 'El teléfono debe tener exactamente 10 caracteres.' })
  @MaxLength(10, { message: 'El teléfono debe tener exactamente 10 caracteres.' })
  @Matches(/^\d+$/, {
    message: 'El número de teléfono solo debe contener dígitos.',
  })
  phone: string;

  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida.' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es requerida.' })
  @Transform(({ value }) => new Date(value))
  birthdate: Date;

  @IsString({ message: 'La contraseña debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(50, { message: 'La contraseña no debe superar los 50 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?:{}|])(?!.*[<>]).{8,}$/, {
    message: 'La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*(),.?:{}|). No puede contener "<" o ">".',
  })
  password: string;

  @IsString({ message: 'El género debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'El género es requerido.' })
  @MinLength(3, { message: 'El género debe tener al menos 3 caracteres.' })
  @MaxLength(20, { message: 'El género no debe superar los 20 caracteres.' })
  gender: Genders;
}
