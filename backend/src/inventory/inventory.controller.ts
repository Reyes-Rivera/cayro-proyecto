import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getInventory(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const pageNum = Number.parseInt(page, 10);
    const limitNum = Number.parseInt(limit, 10);

    return this.inventoryService.getInventory({
      page: pageNum,
      limit: limitNum,
      search,
    });
  }

  @Get('stats')
  async getInventoryStats() {
    return this.inventoryService.getInventoryStats();
  }

  @Get('product/:id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getProductById(id);
  }

  @Get('product/:id/variants')
  async getProductVariants(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getProductVariants(id);
  }

  @Patch('variant/:id/stock')
  async updateVariantStock(
    @Param('id', ParseIntPipe) variantId: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.inventoryService.updateVariantStock(variantId, updateStockDto);
  }

  @Get('low-stock')
  async getLowStockProducts(@Query('threshold') threshold: string = '5') {
    const thresholdNum = Number.parseInt(threshold, 10);
    return this.inventoryService.getLowStockProducts(thresholdNum);
  }

  @Get('categories')
  async getCategories() {
    return this.inventoryService.getCategories();
  }

  @Get('brands')
  async getBrands() {
    return this.inventoryService.getBrands();
  }

  @Get('colors')
  async getColors() {
    return this.inventoryService.getColors();
  }

  @Get('sizes')
  async getSizes() {
    return this.inventoryService.getSizes();
  }
}
