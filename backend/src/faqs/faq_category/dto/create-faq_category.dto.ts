import {
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFaqCategoryDto {
  @IsString({
    message: 'La categoria debe ser de tipo texto.',
  })
  @IsNotEmpty({
    message: 'La categoria es requerida.',
  })
  @MinLength(4, {
    message: 'La categoria debe tener al menos 4 caracteres.',
  })
  @MaxLength(50, {
    message: 'La categoria no puede tener mas de 50 caracteres.',
  })
  name: string;
}
