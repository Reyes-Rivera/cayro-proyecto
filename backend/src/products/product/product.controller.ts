import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('priceMin') priceMin: number,
    @Query('priceMax') priceMax: number,
    @Query('colors') colors: string,
    @Query('sizes') sizes: string,
    @Query('genders') genders: string,
    @Query('sleeves') sleeves: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const res = await this.productService.findAll({
        search,
        category,
        priceMin,
        priceMax,
        colors,
        sizes,
        genders,
        sleeves,
        page,
        limit,
      });

      if (!res || res.total === 0) {
        throw new NotFoundException('No se encontraron productos.');
      }

      return res;
    } catch (error) {
      throw error;
    }
  }

  @Get('get-by-name/:name')
  async findOne(@Param('name') name: string) {
    try {
      const res = await this.productService.findOne(name);
      if (!res) throw new NotFoundException('No se encontraron productos.');
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  @Put('bulk-price-update')
  async updatePricesBulk(@Body() updatePricesDto: any) {
    return this.productService.updatePricesBulk(
      updatePricesDto.filters,
      updatePricesDto.updateData,
    );
  }
  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const res = await this.productService.findById(id);
      if (!res) throw new NotFoundException('No se encontraron productos.');
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const res = await this.productService.remove(+id);
      if (!res) throw new NotFoundException('Producto no encontrado.');
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  @Patch('active/:id')
  async active(@Param('id') id: string) {
    try {
      const res = await this.productService.active(+id);
      if (!res) throw new NotFoundException('Producto no encontrado.');
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
