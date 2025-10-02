import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

export class UpdateStockDto {
  @IsString()
  @IsIn(['ADD', 'SUBTRACT'])
  adjustmentType: 'ADD' | 'SUBTRACT';

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
