import { Transform } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Genders, Role } from '../entities/employee.entity';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString({
    message: 'Solo se aceptan caracteres de tipo texto.',
  })
  @MinLength(3, {
    message: 'El nombre debe contener al menos 3 caracteres.',
  })
  @MaxLength(30, {
    message: 'El nombre no puede exceder los 30 caracteres.',
  })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message:
      'El nombre solo puede contener letras, espacios y caracteres acentuados.',
  })
  name?: string;

  @IsOptional()
  @IsString({
    message: 'Solo se aceptan caracteres de tipo texto.',
  })
  @MinLength(3, {
    message: 'El apellido debe contener al menos 3 caracteres.',
  })
  @MaxLength(50, {
    message: 'El apellido no puede exceder los 50 caracteres.',
  })
  @Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/, {
    message:
      'El apellido solo puede contener letras, espacios y caracteres acentuados.',
  })
  surname?: string;

  @IsOptional()
  @IsString({
    message: 'El correo electrónico debe ser una cadena de texto válida.',
  })
  @MinLength(10, {
    message: 'El correo electrónico debe contener al menos 10 caracteres.',
  })
  @MaxLength(50, {
    message: 'El correo electrónico no puede exceder los 50 caracteres.',
  })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'El correo electrónico debe ser válido (ejemplo@dominio.com).',
  })
  email?: string;

  @IsOptional()
  @IsString({
    message: 'El teléfono debe ser una cadena de texto.',
  })
  @MinLength(10, {
    message: 'El número de teléfono debe contener exactamente 10 dígitos.',
  })
  @MaxLength(10, {
    message: 'El número de teléfono debe contener exactamente 10 dígitos.',
  })
  @Matches(/^\d{10}$/, {
    message:
      'El número de teléfono debe contener solo números y exactamente 10 dígitos.',
  })
  phone?: string;

  @IsOptional()
  @IsDate({
    message: 'La fecha de nacimiento debe ser una fecha válida.',
  })
  @Transform(({ value }) => (value ? new Date(value) : null))
  birthdate?: Date;

  @IsOptional()
  @IsString({
    message: 'El género debe ser una cadena de texto.',
  })
  @MinLength(4, {
    message: 'El género debe contener al menos 4 caracteres.',
  })
  @MaxLength(20, {
    message: 'El género no puede exceder los 20 caracteres.',
  })
  gender?: Genders;

  @IsOptional()
  @IsEnum(Role, {
    message: 'El rol seleccionado no es válido.',
  })
  role?: Role;
}

export class UpdateAddressDto {
  @IsString({ message: 'La calle debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La calle es requerida.' })
  @MinLength(3, { message: 'La calle debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'La calle no debe superar los 100 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message:
      'La calle no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  street: string;

  @IsString({ message: 'La ciudad debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La ciudad es requerida.' })
  @MinLength(2, { message: 'La ciudad debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'La ciudad no debe superar los 50 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message:
      'La ciudad no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  city: string;

  @IsString({ message: 'El estado debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'El estado es requerido.' })
  @MinLength(2, { message: 'El estado debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El estado no debe superar los 50 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message:
      'El estado no puede contener los caracteres "<", ">", "\'" o \'"\'.',
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
  @MinLength(5, {
    message: 'El código postal debe tener al menos 5 caracteres.',
  })
  @MaxLength(10, {
    message: 'El código postal no debe superar los 10 caracteres.',
  })
  @Matches(/^\d+$/, {
    message: 'El código postal solo debe contener números.',
  })
  postalCode: string;

  @IsString({ message: 'La colonia debe ser de tipo texto.' })
  @IsNotEmpty({ message: 'La colonia es requerida.' })
  @MinLength(3, { message: 'La colonia debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'La colonia no debe superar los 100 caracteres.' })
  @Matches(/^(?!.*[<>"']).+$/, {
    message:
      'La colonia no puede contener los caracteres "<", ">", "\'" o \'"\'.',
  })
  colony: string;
}
export class PasswordUpdate {
  @IsString({
    message: 'La contraseña debe de ser de tipo texto.',
  })
  @IsNotEmpty({
    message: 'La contraseña es requerida.',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(50, {
    message: 'La contraseña no debe superar los 50 caracteres.',
  })
  password: string;

  @IsString({
    message: 'La contraseña debe de ser de tipo texto.',
  })
  @IsNotEmpty({
    message: 'La contraseña es requerida.',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @MaxLength(50, {
    message: 'La contraseña no debe superar los 50 caracteres.',
  })
  currentPassword: string;
}
