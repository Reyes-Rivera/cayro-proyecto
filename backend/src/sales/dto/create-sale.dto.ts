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
