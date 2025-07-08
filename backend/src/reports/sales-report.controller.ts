import {
  Controller,
  Get,
  Query,
  BadRequestException,
  Res,
} from '@nestjs/common';
import type { SalesReportFiltersDto } from './dto/filters.dto';
import { Response } from 'express';
import { SalesReportService } from './sales-report.service';

@Controller('sales-report')
export class SalesReportController {
  constructor(private readonly salesReportService: SalesReportService) {}

  @Get('pdf')
  async downloadPdf(
    @Res() res: Response,
    @Query() filters: SalesReportFiltersDto,
  ) {
    try {
      if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        if (start > end) {
          throw new BadRequestException(
            'La fecha de inicio no puede ser mayor que la fecha de fin',
          );
        }
      }

      const data = await this.salesReportService.getSalesReport(filters);
      const buffer = await this.salesReportService.generatePdf(data);

      const fileName = this.generateFileName(filters);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.send(buffer);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        `Error generando reporte: ${error.message}`,
      );
    }
  }

  @Get('preview')
  async previewPdf(
    @Res() res: Response,
    @Query() filters: SalesReportFiltersDto,
  ) {
    try {
      const data = await this.salesReportService.getSalesReport(filters);
      const buffer = await this.salesReportService.generatePdf(data);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.send(buffer);
    } catch (error) {
      throw new BadRequestException(
        `Error generando vista previa: ${error.message}`,
      );
    }
  }

  @Get('data')
  async getReportData(@Query() filters: SalesReportFiltersDto) {
    try {
      return await this.salesReportService.getSalesReport(filters);
    } catch (error) {
      throw new BadRequestException(`Error obteniendo datos: ${error.message}`);
    }
  }

  private generateFileName(filters: SalesReportFiltersDto): string {
    const date = new Date().toISOString().split('T')[0];
    let fileName = `reporte-ventas-${date}`;

    if (filters.startDate && filters.endDate) {
      fileName += `_${filters.startDate}_${filters.endDate}`;
    } else if (filters.startDate) {
      fileName += `_desde-${filters.startDate}`;
    } else if (filters.endDate) {
      fileName += `_hasta-${filters.endDate}`;
    }

    if (filters.categoryId) {
      fileName += `_cat-${filters.categoryId}`;
    }

    if (filters.city) {
      fileName += `_${filters.city.toLowerCase().replace(/\s+/g, '-')}`;
    }

    return `${fileName}.pdf`;
  }
}
