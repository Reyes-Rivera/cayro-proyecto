import { PartialType } from '@nestjs/mapped-types';
import { CreateRegulatoryDocumentDto } from './create-regulatory-document.dto';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { DocumentTypeInter, Status } from '../entities/enums';

export class UpdateRegulatoryDocumentDto extends PartialType(CreateRegulatoryDocumentDto) {
    @IsString()
    @IsOptional()
    @MinLength(4)
    @MaxLength(100)
    title?: string;

    @IsString()
    @IsOptional()
    @MinLength(4)
    content: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    version?: number;

    @IsOptional()
    @IsDate()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    updatedAt: Date;

    @IsOptional()
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
