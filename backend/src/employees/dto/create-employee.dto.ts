import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  Matches,
  IsBoolean,
} from 'class-validator';
import { Genders, Role } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsString({
    message: 'Solo se aceptan caracteres de tipo texto.',
  })
  @IsNotEmpty({
    message: 'El nombre es requerido.',
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
  name: string;

  @IsString({
    message: 'Solo se aceptan caracteres de tipo texto.',
  })
  @IsNotEmpty({
    message: 'El apellido es requerido.',
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
  surname: string;

  @IsString({
    message: 'El correo electrónico debe ser una cadena de texto válida.',
  })
  @IsNotEmpty({
    message: 'El correo electrónico es requerido.',
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
  email: string;

  @IsString({
    message: 'El teléfono debe ser una cadena de texto.',
  })
  @IsNotEmpty({
    message: 'El número de teléfono es requerido.',
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
  phone: string;

  @IsDate({
    message: 'La fecha de nacimiento debe ser una fecha válida.',
  })
  @IsNotEmpty({
    message: 'La fecha de nacimiento es requerida.',
  })
  @Transform(({ value }) => new Date(value))
  birthdate: Date;

  @IsNotEmpty({
    message: 'La contraseña es requerida.',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto.',
  })
  @MinLength(8, {
    message: 'La contraseña debe contener al menos 8 caracteres.',
  })
  @MaxLength(50, {
    message: 'La contraseña no puede exceder los 50 caracteres.',
  })
  password: string;

  @IsNotEmpty({
    message: 'El género es requerido.',
  })
  @IsString({
    message: 'El género debe ser una cadena de texto.',
  })
  @MinLength(4, {
    message: 'El género debe contener al menos 4 caracteres.',
  })
  @MaxLength(20, {
    message: 'El género no puede exceder los 20 caracteres.',
  })
  gender: Genders;

  @IsNotEmpty({
    message: 'El rol es requerido.',
  })
  @IsEnum(Role, {
    message: 'El rol seleccionado no es válido.',
  })
  role: Role;
  @IsBoolean({
    message: 'El campo active debe ser un booleano',
  })
  active: boolean;
}
