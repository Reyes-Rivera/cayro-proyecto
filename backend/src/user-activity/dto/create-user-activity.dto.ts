import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserActivityDto {
  @IsNotEmpty({
    message: 'El correo es obligatorio.',
  })
  @IsString()
  @MinLength(10, {
    message: 'El correo debe de tener al menos 10 caracteres.',
  })
  @MaxLength(200, {
    message: 'El correo debe tener maximo 200 caracteres.',
  })
  email: string;

  @IsString({
    message: 'La acción debe de ser te tipo texto.',
  })
  @IsOptional()
  @MinLength(5, {
    message: 'Introduce al menos 5 caracteres.',
  })
  @MaxLength(10, {
    message: 'Debe de contener 10 caracteres.',
  })
  action?: string;
  @IsOptional()
  @IsDate({
    message: 'El formato debe ser de tipo fecha.',
  })
  date?: Date;
}
