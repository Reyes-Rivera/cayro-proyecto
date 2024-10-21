import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

import { DocumentTypeInter, Status } from "../entities/enums";
import { Transform } from "class-transformer";

export class CreateRegulatoryDocumentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    content: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    version: number;

    @IsOptional()
    @IsDate()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    updatedAt: Date;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    effectiveDate: Date;

    @IsOptional()
    @IsBoolean()
    isDeleted: boolean;

    @IsOptional()
    @IsBoolean()
    isCurrentVersion: boolean;

    @IsOptional()
    @IsString()
    previousVersionId?: string;

    @IsOptional()
    @IsNotEmpty()
    status: Status;

    @IsString()
    @IsOptional()
    type?:DocumentTypeInter;
}
