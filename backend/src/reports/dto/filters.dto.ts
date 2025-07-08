import { IsOptional, IsString, IsInt, IsDateString, Min } from "class-validator"
import { Transform, Type } from "class-transformer"

export class SalesReportFiltersDto {
  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  city?: string

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  state?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeeId?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  brandId?: number
}
