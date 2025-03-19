import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateSecurityQuestionDto {
  @IsString({ message: 'La pregunta debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La pregunta de seguridad es obligatoria.' })
  @MinLength(10, {
    message: 'La pregunta debe contener al menos 10 caracteres.',
  })
  @MaxLength(255, {
    message: 'La pregunta no puede exceder los 255 caracteres.',
  })
  question: string;
}
