import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class UpdateAddressDto {
  @IsString({ message: 'La calle debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La calle es requerida.' })
  @MinLength(3, { message: 'La calle debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'La calle no debe superar los 100 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: 'La calle no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  street: string;

  @IsString({ message: 'La ciudad debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La ciudad es requerida.' })
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'La ciudad no debe superar los 50 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: 'La ciudad no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  city: string;

  @IsString({ message: 'El estado debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'El estado es requerido.' })
  @MinLength(2, { message: 'El estado debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El estado no debe superar los 50 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: 'El estado no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  state: string;

  @IsString({ message: 'El país debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'El país es requerido.' })
  @MinLength(2, { message: 'El país debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El país no debe superar los 50 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: 'El país no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  country: string;

  @IsString({ message: 'El código postal debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'El código postal es requerido.' })
  @MinLength(5, { message: 'El código postal debe tener al menos 5 caracteres.' })
  @MaxLength(10, { message: 'El código postal no debe superar los 10 caracteres.' })
  @Matches(/^\d+$/, {
    message: 'El código postal solo debe contener números.',
  })
  postalCode: string;

  @IsString({ message: 'La colonia debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La colonia es requerida.' })
  @MinLength(3, { message: 'La colonia debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'La colonia no debe superar los 100 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message: 'La colonia no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  colony: string;
}
