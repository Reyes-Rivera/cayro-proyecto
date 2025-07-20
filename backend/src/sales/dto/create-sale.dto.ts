export class CreateSaleDto {}
import { SaleStatus } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class ChangeStatusDto {
  @IsInt()
  id: number;

  @IsInt()
  userId: number;

  @IsEnum(SaleStatus)
  status: SaleStatus;
}

// src/analytics/dto/sales-analysis.dto.ts
export class SalesAnalysisItemDto {
  id: number;
  userId: number;
  productName: string;
  category: string;
  brand: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  saleDate: Date;
}

export class SalesAnalysisResponseDto {
  data: SalesAnalysisItemDto[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
