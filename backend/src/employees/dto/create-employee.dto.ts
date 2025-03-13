import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  Matches,
} from 'class-validator';
import { Genders, Role } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsString({
    message:"Solo se aceptan caracteres de tipo texto."
  })
  @IsNotEmpty({
    message: 'El nombre es requerido.',
  })
  @MinLength(3, {
    message: 'Introduce al menos 3 caracteres.',
  })
  @MaxLength(30, {
    message: 'Introduce maximo 30 caracteres.',
  })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message:
      'Por favor, ingrese solo letras (mayúsculas o minúsculas), espacios y caracteres acentuados.',
  })
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
