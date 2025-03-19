import { IsString, IsOptional, IsEmail, MinLength, MaxLength, Matches, IsDate, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { Genders } from 'src/employees/entities/employee.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Solo se permiten caracteres de tipo texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'Por favor, ingrese solo letras, espacios y caracteres acentuados.',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Solo se permiten caracteres de tipo texto.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
  @MaxLength(50, { message: 'El apellido no debe superar los 50 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message: 'Por favor, ingrese solo letras, espacios y caracteres acentuados.',
  })
  surname?: string;

  @IsOptional()
  @IsString({ message: 'El correo electrónico debe ser un texto válido.' })
  @IsEmail({}, { message: 'Por favor, ingrese un correo electrónico válido.' })
  @MinLength(10, { message: 'El correo debe tener al menos 10 caracteres.' })
  @MaxLength(50, { message: 'El correo no debe superar los 50 caracteres.' })
  @Matches(/^(?!.*[<>])^\S+@\S+\.\S+$/, {
    message: 'El correo electrónico no debe contener los caracteres "<" o ">", ni espacios.',
  })
  email?: string;

  @IsOptional()
  @IsString({ message: 'El número de teléfono debe ser de tipo texto.' })
  @MinLength(10, { message: 'El teléfono debe tener exactamente 10 caracteres.' })
  @MaxLength(10, { message: 'El teléfono debe tener exactamente 10 caracteres.' })
  @Matches(/^\d+$/, {
    message: 'El número de teléfono solo debe contener dígitos.',
  })
  phone?: string;

  @IsOptional()
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida.' })
  @Transform(({ value }) => (value ? new Date(value) : null))
  birthdate?: Date;

  @IsOptional()
  @IsString({ message: 'El género debe ser de tipo texto.' })
  @MinLength(3, { message: 'El género debe tener al menos 3 caracteres.' })
  @MaxLength(20, { message: 'El género no debe superar los 20 caracteres.' })
  gender?: Genders;
}


export class PasswordUpdate{
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    password: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(50)
    currentPassword: string;
}
