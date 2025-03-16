import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateQuestionDto {
  @IsString({
    message: 'La pregunta debe ser de tipo texto.',
  })
  @IsNotEmpty({
    message: 'La pregunta es requerida.',
  })
  @MinLength(4, {
    message: 'La pregunta debe tener al menos 4 caracteres.',
  })
  @MaxLength(5000, {
    message: 'La pregunta no puede tener mas de 5000 caracteres.',
  })
  question: string;

  @IsString({
    message: 'La respuesta debe ser de tipo texto.',
  })
  @IsNotEmpty({
    message: 'La respuesta es requerida.',
  })
  @MinLength(4, {
    message: 'La respuesta debe tener al menos 4 caracteres.',
  })
  @MaxLength(5000, {
    message: 'La respuesta no puede tener mas de 5000 caracteres.',
  })
  answer: string;

  @IsNumber()
  @Min(1,{message:"Ingresa una categoria existente."})
  categoryId: number;
}
