import {  IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EmailDataDto {
  @IsString({
    message:"El titulo debe ser de tipo texto."
  })
  @IsNotEmpty({
    message:"El titulo es requerido."
  })
  title: string;

  @IsNotEmpty()
  greeting: string;

  @IsNotEmpty()
  maininstruction: string;

  @IsNotEmpty()
  secondaryinstruction: string;

  @IsNotEmpty()
  expirationtime: string;

  @IsNotEmpty()
  finalMessage: string;

  @IsNotEmpty()
  signature: string;
}

export class CreateConfigurationDto {
  @IsInt()
  timeTokenLogin: number;

  @IsInt()
  timeTokenEmail: number;

  @IsInt()
  attemptsLogin: number;

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => EmailDataDto)
  emailVerificationInfo: [];

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => EmailDataDto)
  emailLogin: [];

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => EmailDataDto)
  emailResetPass: [];
}
