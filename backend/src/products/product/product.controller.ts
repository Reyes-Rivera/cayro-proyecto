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
  @Get('current-month')
  async getCurrentMonthStats() {
    try {
      const stats = await this.productService.getCurrentMonthStats();
      return {
        success: true,
        data: stats,
        message: 'Estadísticas del mes actual obtenidas correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener las estadísticas',
        error: error.message,
      };
    }
  }

  @Get('monthly')
  async getMonthlyStats(
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    try {
      const monthNumber = month ? parseInt(month) : undefined;
      const yearNumber = year ? parseInt(year) : undefined;

      if (monthNumber && (monthNumber < 1 || monthNumber > 12)) {
        return {
          success: false,
          message: 'El mes debe estar entre 1 y 12',
        };
      }

      const stats = await this.productService.getMonthlyStats(
        monthNumber,
        yearNumber,
      );

      return {
        success: true,
        data: stats,
        message: 'Estadísticas mensuales obtenidas correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener las estadísticas mensuales',
        error: error.message,
      };
    }
  }

  @Get('detailed')
  async getDetailedStats() {
    try {
      const stats = await this.productService.getDetailedStats();
      return {
        success: true,
        data: stats,
        message: 'Estadísticas detalladas obtenidas correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener las estadísticas detalladas',
        error: error.message,
      };
    }
  }

  @Get('top-products')
  async getTopProducts(@Query('limit') limit: string) {
    try {
      const limitNumber = limit ? parseInt(limit) : 5;
      const topProducts = await this.productService.getTopProducts(limitNumber);

      return {
        success: true,
        data: topProducts,
        message: 'Productos más vendidos obtenidos correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener los productos más vendidos',
        error: error.message,
      };
    }
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
