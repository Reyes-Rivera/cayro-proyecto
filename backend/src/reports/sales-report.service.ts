import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import type { SalesReportData } from './interface/sales-report-data.interface';
import type { SaleStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SalesReportService {
  constructor(private prisma: PrismaService) {}

async getSalesReport(filters: any): Promise<SalesReportData> {
  const startDate = filters.startDate ? new Date(filters.startDate) : undefined;
  const endDate = filters.endDate ? new Date(filters.endDate) : undefined;

  const createdAtFilter =
    (startDate && !isNaN(startDate.getTime())) || (endDate && !isNaN(endDate.getTime()))
      ? {
          ...(startDate && !isNaN(startDate.getTime()) ? { gte: startDate } : {}),
          ...(endDate && !isNaN(endDate.getTime()) ? { lte: endDate } : {}),
        }
      : undefined;

  const city = filters.city ? filters.city.toLowerCase() : undefined;
  const state = filters.state ? filters.state.toLowerCase() : undefined;

  const whereClause: any = {
    status: 'DELIVERED',
    ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    ...(filters.categoryId
      ? {
          saleDetails: {
            some: {
              productVariant: {
                product: {
                  categoryId: +filters.categoryId,
                },
              },
            },
          },
        }
      : {}),
    ...(city || state
      ? {
          address: {
            is: {
              ...(city ? { city: { contains: city } } : {}),
              ...(state ? { state: { contains: state } } : {}),
            },
          },
        }
      : {}),
  };

  const sales = await this.prisma.sale.findMany({
    where: whereClause,
    include: {
      saleDetails: {
        include: {
          productVariant: {
            include: {
              product: { include: { category: true, brand: true, gender: true } },
              color: true,
              size: true,
            },
          },
        },
      },
      address: true,
      user: true,
      employee: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totals = {
    totalSales: sales.length,
    totalRevenue: sales.reduce((acc, s) => acc + Number(s.totalAmount), 0),
    totalProducts: sales.reduce((acc, s) => acc + s.saleDetails.reduce((sum, d) => sum + d.quantity, 0), 0),
    averageOrderValue: sales.length > 0
      ? sales.reduce((acc, s) => acc + Number(s.totalAmount), 0) / sales.length
      : 0,
  };

  const monthlySales: Record<string, any> = {};
  const topProducts: Record<string, { totalSold: number; totalRevenue: number }> = {};
  const salesByCategory: Record<string, any> = {};
  const salesByCity: Record<string, any> = {};
  const salesByEmployee: Record<string, any> = {};
  const salesByBrand: Record<string, any> = {};
  const salesByGender: Record<string, any> = {};
  const topVariants: Record<string, any> = {};

  sales.forEach((sale) => {
    const monthKey = sale.createdAt.toISOString().substring(0, 7);
    monthlySales[monthKey] = monthlySales[monthKey] || { salesCount: 0, revenue: 0, productsSold: 0 };
    monthlySales[monthKey].salesCount++;
    monthlySales[monthKey].revenue += Number(sale.totalAmount);
    monthlySales[monthKey].productsSold += sale.saleDetails.reduce((sum, d) => sum + d.quantity, 0);

    const cityKey = sale.address?.city?.toLowerCase() || 'sin especificar';
    salesByCity[cityKey] = salesByCity[cityKey] || { salesCount: 0, revenue: 0, productsSold: 0 };
    salesByCity[cityKey].salesCount++;
    salesByCity[cityKey].revenue += Number(sale.totalAmount);

    const employeeKey = `${sale.employee?.name || ''} ${sale.employee?.surname || ''}`.trim() || 'sin asignar';
    salesByEmployee[employeeKey] = salesByEmployee[employeeKey] || { salesCount: 0, revenue: 0, productsSold: 0 };
    salesByEmployee[employeeKey].salesCount++;
    salesByEmployee[employeeKey].revenue += Number(sale.totalAmount);

    sale.saleDetails.forEach((detail) => {
      const productName = detail.productVariant.product.name;
      const categoryName = detail.productVariant.product.category?.name || 'Sin categoría';
      const brandName = detail.productVariant.product.brand?.name || 'Sin marca';
      const genderName = detail.productVariant.product.gender?.name || 'Sin género';
      const variantKey = `${productName} - ${detail.productVariant.color.name}/${detail.productVariant.size.name}`;

      // Productos más vendidos
      topProducts[productName] = topProducts[productName] || { totalSold: 0, totalRevenue: 0 };
      topProducts[productName].totalSold += detail.quantity;
      topProducts[productName].totalRevenue += detail.totalPrice;

      // Variantes
      topVariants[variantKey] = topVariants[variantKey] || {
        productName,
        colorName: detail.productVariant.color.name,
        colorHex: detail.productVariant.color.hexValue,
        sizeName: detail.productVariant.size.name,
        totalSold: 0,
        totalRevenue: 0,
      };
      topVariants[variantKey].totalSold += detail.quantity;
      topVariants[variantKey].totalRevenue += detail.totalPrice;

      // Categoría
      salesByCategory[categoryName] = salesByCategory[categoryName] || { salesCount: 0, revenue: 0, productsSold: 0 };
      salesByCategory[categoryName].productsSold += detail.quantity;
      salesByCategory[categoryName].revenue += detail.totalPrice;

      // Marca
      salesByBrand[brandName] = salesByBrand[brandName] || { salesCount: 0, revenue: 0, productsSold: 0 };
      salesByBrand[brandName].productsSold += detail.quantity;
      salesByBrand[brandName].revenue += detail.totalPrice;

      // Género
      salesByGender[genderName] = salesByGender[genderName] || { salesCount: 0, revenue: 0, productsSold: 0 };
      salesByGender[genderName].productsSold += detail.quantity;
      salesByGender[genderName].revenue += detail.totalPrice;

      // Actualizar ciudad y empleado
      salesByCity[cityKey].productsSold += detail.quantity;
      salesByEmployee[employeeKey].productsSold += detail.quantity;
    });
  });

  return {
    totals,
    monthlySales,
    salesByCategory,
    salesByCity,
    salesByEmployee,
    salesByBrand,
    salesByGender,
    topProducts: Object.entries(topProducts).map(([productName, stats]) => ({
      productName,
      totalSold: stats.totalSold,
      totalRevenue: stats.totalRevenue,
    })),
    topVariants: Object.entries(topVariants).map(([variantName, stats]) => ({
      variantName,
      ...stats,
    })),
    rawSales: sales,
  };
}


  async generatePdf(data: SalesReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 50,
          size: 'A4',
          info: {
            Title: 'Reporte de Ventas',
            Author: 'Sistema de Ventas',
            Subject: 'Análisis Detallado de Rendimiento Comercial',
            Keywords: 'ventas, reporte, análisis, comercial',
          },
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (error) => reject(error));

        // Colores corporativos mejorados
        const primaryColor = '#2563eb';
        const secondaryColor = '#64748b';
        const accentColor = '#f1f5f9';
        const lightBlue = '#dbeafe';
        const darkBlue = '#1e40af';

        // HEADER MEJORADO
        this.addEnhancedHeader(doc, primaryColor, darkBlue);

        // INFORMACIÓN DEL REPORTE
        this.addReportInfo(doc, secondaryColor);

        // RESUMEN EJECUTIVO MEJORADO
        this.addEnhancedExecutiveSummary(
          doc,
          data.totals,
          primaryColor,
          accentColor,
          lightBlue,
        );

        // NUEVA PÁGINA PARA GRÁFICOS
        doc.addPage();

        // VENTAS POR MES
        this.addEnhancedMonthlySalesChart(doc, data.monthlySales, primaryColor);

        // PRODUCTOS MÁS VENDIDOS
        this.addEnhancedTopProductsTable(doc, data.topProducts, primaryColor);

        // NUEVA PÁGINA PARA VARIANTES MÁS VENDIDAS
        doc.addPage();

        // VARIANTES MÁS VENDIDAS
        this.addEnhancedTopVariantsTable(doc, data.topVariants, primaryColor);

        // NUEVA PÁGINA PARA ANÁLISIS POR CATEGORÍAS
        doc.addPage();

        // VENTAS POR CATEGORÍA
        this.addEnhancedCategoryAnalysis(
          doc,
          data.salesByCategory,
          primaryColor,
        );

        // VENTAS POR EMPLEADO
        this.addEnhancedEmployeeAnalysis(
          doc,
          data.salesByEmployee,
          primaryColor,
        );

        // NUEVA PÁGINA PARA ANÁLISIS GEOGRÁFICO
        doc.addPage();

        // VENTAS POR CIUDAD
        this.addEnhancedGeographicAnalysis(doc, data.salesByCity, primaryColor);

        // VENTAS POR MARCA Y GÉNERO
        this.addEnhancedBrandGenderAnalysis(
          doc,
          data.salesByBrand,
          data.salesByGender,
          primaryColor,
        );

        // NUEVA PÁGINA PARA DETALLES
        doc.addPage();

        // DETALLE DE VENTAS
        this.addEnhancedSalesDetails(doc, data.rawSales, primaryColor);

        // Finalizar el documento
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addEnhancedHeader(doc: any, primaryColor: string, darkBlue: string) {
    // Fondo del header con gradiente simulado
    doc.rect(0, 0, 595, 120).fill(primaryColor);
    doc.rect(0, 0, 595, 60).fill(darkBlue);

    // Logo de la empresa - mejorado para usar imagen real o placeholder
    const logoX = 45;
    const logoY = 35;
    const logoSize = 70;

    // Fondo blanco para el logo
    doc
      .rect(logoX, logoY, logoSize, logoSize)
      .fill('#ffffff')
      .stroke('#e2e8f0');

    // Si tienes un logo, descomenta y ajusta la ruta:
    doc.image('./src/reports/logo-cayro.png', logoX + 5, logoY + 5, {
      width: logoSize - 10,
      height: logoSize - 10,
    });

    // Título principal mejorado
    doc
      .fillColor('#ffffff')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('REPORTE DE VENTAS', 140, 45);

    // Subtítulo con mejor espaciado
    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#e2e8f0')
      .text('Análisis Detallado de Rendimiento Comercial', 140, 75);

    // Línea decorativa
    doc
      .moveTo(140, 95)
      .lineTo(500, 95)
      .strokeColor('#ffffff')
      .lineWidth(2)
      .stroke();

    // Resetear posición
    doc.y = 140;
  }

  private addReportInfo(doc: any, secondaryColor: string) {
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Caja de información del reporte
    doc.rect(50, doc.y, 495, 50).fill('#f8fafc').stroke('#e2e8f0');

    doc
      .fillColor(secondaryColor)
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('INFORMACIÓN DEL REPORTE', 60, doc.y + 10);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Fecha de generación: ${currentDate}`, 60, doc.y + 25)
      .text('Período: Todas las ventas entregadas', 300, doc.y);

    doc.y += 70;
  }

  private addEnhancedExecutiveSummary(
    doc: any,
    totals: any,
    primaryColor: string,
    accentColor: string,
    lightBlue: string,
  ) {
    // Título de sección con fondo
    doc.rect(50, doc.y, 495, 30).fill(lightBlue);
    doc
      .fillColor(primaryColor)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('RESUMEN EJECUTIVO', 60, doc.y + 8);

    doc.y += 50;

    // Métricas mejoradas con iconos y colores
    const metrics = [
      {
        label: 'Total de Ventas',
        value: totals.totalSales.toLocaleString(),
        icon: '#',
        color: '#10b981',
        bgColor: '#d1fae5',
      },
      {
        label: 'Ingresos Totales',
        value: `$${totals.totalRevenue.toLocaleString()}`,
        icon: '$',
        color: '#3b82f6',
        bgColor: '#dbeafe',
      },
      {
        label: 'Productos Vendidos',
        value: totals.totalProducts.toLocaleString(),
        icon: 'U',
        color: '#8b5cf6',
        bgColor: '#ede9fe',
      },
      {
        label: 'Ticket Promedio',
        value: `$${totals.averageOrderValue.toFixed(2)}`,
        icon: 'A',
        color: '#f59e0b',
        bgColor: '#fef3c7',
      },
    ];

    // Calcular posiciones para que las cajas se ajusten correctamente
    const startX = 50;
    const boxWidth = 115;
    const boxHeight = 85;
    const spacing = 10;
    const totalWidth = boxWidth * 4 + spacing * 3;
    const availableWidth = 495;
    const offsetX = (availableWidth - totalWidth) / 2;

    let xPos = startX + offsetX;
    const baseY = doc.y;

    metrics.forEach((metric, index) => {
      // Sombra de la caja
      doc.rect(xPos + 3, baseY + 3, boxWidth, boxHeight).fill('#00000015');

      // Caja principal con gradiente simulado
      doc
        .rect(xPos, baseY, boxWidth, boxHeight)
        .fill(metric.bgColor)
        .stroke('#e5e7eb');

      // Barra superior de color
      doc.rect(xPos, baseY, boxWidth, 6).fill(metric.color);

      // Icono
      doc
        .fillColor(metric.color)
        .fontSize(20)
        .font('Helvetica-Bold')
        .text(metric.icon, xPos + 12, baseY + 15);

      // Valor principal - ajustar tamaño de fuente según longitud
      const fontSize = metric.value.length > 8 ? 16 : 18;
      doc
        .fillColor('#1f2937')
        .fontSize(fontSize)
        .font('Helvetica-Bold')
        .text(metric.value, xPos + 12, baseY + 38, { width: boxWidth - 20 });

      // Label con mejor ajuste
      doc
        .fillColor('#6b7280')
        .fontSize(8)
        .font('Helvetica')
        .text(metric.label, xPos + 12, baseY + 65, { width: boxWidth - 20 });

      xPos += boxWidth + spacing;
    });

    doc.y = baseY + boxHeight + 30;
  }

  private addEnhancedMonthlySalesChart(
    doc: any,
    monthlySales: Record<string, any>,
    primaryColor: string,
  ) {
    // Título con línea decorativa
    this.addSectionTitle(doc, 'VENTAS POR MES', primaryColor);

    const sortedMonths = Object.entries(monthlySales)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);

    if (sortedMonths.length > 0) {
      const tableY = doc.y;
      const colWidths = [120, 90, 110, 100];
      const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

      // Centrar la tabla en la página
      const pageWidth = 595;
      const marginLeft = (pageWidth - tableWidth) / 2;

      // Header mejorado y centrado
      doc.rect(marginLeft, tableY, tableWidth, 25).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Mes', marginLeft + 10, tableY + 7)
        .text('Ventas', marginLeft + colWidths[0], tableY + 7)
        .text('Ingresos', marginLeft + colWidths[0] + colWidths[1], tableY + 7)
        .text(
          'Productos',
          marginLeft + colWidths[0] + colWidths[1] + colWidths[2],
          tableY + 7,
        );

      let rowY = tableY + 30;
      sortedMonths.forEach(([month, data], index) => {
        // Alternar colores con mejor contraste
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        doc
          .rect(marginLeft, rowY - 3, tableWidth, 22)
          .fill(bgColor)
          .stroke('#e5e7eb');

        const monthName = new Date(month + '-01').toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
        });

        doc
          .fillColor('#374151')
          .fontSize(10)
          .font('Helvetica')
          .text(monthName, marginLeft + 10, rowY)
          .text(data.salesCount.toString(), marginLeft + colWidths[0], rowY)
          .text(
            `$${data.revenue.toLocaleString()}`,
            marginLeft + colWidths[0] + colWidths[1],
            rowY,
          )
          .text(
            data.productsSold.toString(),
            marginLeft + colWidths[0] + colWidths[1] + colWidths[2],
            rowY,
          );

        rowY += 22;
      });

      doc.y = rowY + 20;
    }
  }

  private addEnhancedTopProductsTable(
    doc: any,
    topProducts: any[],
    primaryColor: string,
  ) {
    this.addSectionTitle(doc, 'TOP 10 PRODUCTOS MÁS VENDIDOS', primaryColor);

    if (topProducts.length > 0) {
      const tableY = doc.y;
      const colWidths = [300, 90, 110];

      // Header
      doc.rect(50, tableY, 500, 25).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Producto', 60, tableY + 7)
        .text('Cantidad', 60 + colWidths[0], tableY + 7)
        .text('Ingresos', 60 + colWidths[0] + colWidths[1], tableY + 7);

      let rowY = tableY + 30;
      topProducts.slice(0, 10).forEach((product, index) => {
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        doc
          .rect(50, rowY - 3, 500, 22)
          .fill(bgColor)
          .stroke('#e5e7eb');

        // Número de ranking con círculo
        doc.circle(65, rowY + 8, 8).fill(primaryColor);
        doc
          .fillColor('#ffffff')
          .fontSize(8)
          .font('Helvetica-Bold')
          .text((index + 1).toString(), 62, rowY + 5);

        let productName = product.productName;
        if (productName.length > 45) {
          productName = productName.substring(0, 42) + '...';
        }

        doc
          .fillColor('#374151')
          .fontSize(10)
          .font('Helvetica')
          .text(productName, 80, rowY, { width: colWidths[0] - 30 })
          .text(product.totalSold.toString(), 60 + colWidths[0], rowY)
          .text(
            `$${product.totalRevenue.toLocaleString()}`,
            60 + colWidths[0] + colWidths[1],
            rowY,
          );

        rowY += 22;
      });

      doc.y = rowY + 20;
    }
  }

  private addEnhancedTopVariantsTable(
    doc: any,
    topVariants: any[],
    primaryColor: string,
  ) {
    this.addSectionTitle(doc, 'TOP 15 VARIANTES MÁS VENDIDAS', primaryColor);

    if (topVariants.length > 0) {
      const tableY = doc.y;
      const colWidths = [240, 80, 60, 70, 90];
      const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);

      // Centrar la tabla en la página
      const pageWidth = 595; // Ancho de página A4
      const marginLeft = (pageWidth - tableWidth) / 2;

      // Header centrado
      doc.rect(marginLeft, tableY, tableWidth, 25).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Producto / Variante', marginLeft + 10, tableY + 7)
        .text('Color', marginLeft + colWidths[0], tableY + 7)
        .text('Talla', marginLeft + colWidths[0] + colWidths[1], tableY + 7)
        .text(
          'Cant.',
          marginLeft + colWidths[0] + colWidths[1] + colWidths[2],
          tableY + 7,
        )
        .text(
          'Ingresos',
          marginLeft +
            colWidths[0] +
            colWidths[1] +
            colWidths[2] +
            colWidths[3],
          tableY + 7,
        );

      let rowY = tableY + 30;
      topVariants.forEach((variant, index) => {
        // Alternar color de fondo para las filas
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        doc
          .rect(marginLeft, rowY - 3, tableWidth, 22)
          .fill(bgColor)
          .stroke('#e5e7eb');

        // Número de ranking
        doc.circle(marginLeft + 15, rowY + 8, 8).fill(primaryColor);
        doc
          .fillColor('#ffffff')
          .fontSize(8)
          .font('Helvetica-Bold')
          .text(
            (index + 1).toString(),
            index < 9 ? marginLeft + 12 : marginLeft + 10,
            rowY + 5,
          );

        let productName = variant.productName;
        if (productName.length > 35) {
          productName = productName.substring(0, 32) + '...';
        }

        // Cuadrado de color mejorado con mejor posicionamiento
        const colorX = marginLeft + colWidths[0] - 18;
        const colorY = rowY + 4;

        if (variant.colorHex && variant.colorHex !== '') {
          try {
            // Validar que el color sea un hex válido
            const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            const colorToUse = hexRegex.test(variant.colorHex)
              ? variant.colorHex
              : '#cccccc';

            doc
              .rect(colorX, colorY, 14, 14)
              .fill(colorToUse)
              .stroke('#9ca3af')
              .lineWidth(0.5);
          } catch (error) {
            // Color por defecto si hay error
            doc
              .rect(colorX, colorY, 14, 14)
              .fill('#cccccc')
              .stroke('#9ca3af')
              .lineWidth(0.5);
          }
        } else {
          // Sin color especificado
          doc
            .rect(colorX, colorY, 14, 14)
            .fill('#f3f4f6')
            .stroke('#9ca3af')
            .lineWidth(0.5);
        }

        doc
          .fillColor('#374151')
          .fontSize(9)
          .font('Helvetica')
          .text(productName, marginLeft + 30, rowY, {
            width: colWidths[0] - 40,
          })
          .text(variant.colorName || 'N/A', marginLeft + colWidths[0] + 8, rowY)
          .text(
            variant.sizeName || 'N/A',
            marginLeft + colWidths[0] + colWidths[1],
            rowY,
          )
          .text(
            variant.totalSold.toString(),
            marginLeft + colWidths[0] + colWidths[1] + colWidths[2],
            rowY,
          )
          .text(
            `$${variant.totalRevenue.toLocaleString()}`,
            marginLeft +
              colWidths[0] +
              colWidths[1] +
              colWidths[2] +
              colWidths[3],
            rowY,
          );

        rowY += 22;
      });

      doc.y = rowY + 20;
    }
  }

  private addEnhancedCategoryAnalysis(
    doc: any,
    salesByCategory: Record<string, any>,
    primaryColor: string,
  ) {
    this.addSectionTitle(doc, 'ANÁLISIS POR CATEGORÍA', primaryColor);

    const categories = Object.entries(salesByCategory).sort(
      ([, a], [, b]) => b.revenue - a.revenue,
    );

    if (categories.length > 0) {
      const tableY = doc.y;
      const colWidths = [160, 100, 120, 80];

      // Header
      doc.rect(50, tableY, 460, 25).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Categoría', 60, tableY + 7)
        .text('Productos', 60 + colWidths[0], tableY + 7)
        .text('Ingresos', 60 + colWidths[0] + colWidths[1], tableY + 7)
        .text(
          '% Total',
          60 + colWidths[0] + colWidths[1] + colWidths[2],
          tableY + 7,
        );

      let rowY = tableY + 30;
      const totalRevenue = categories.reduce(
        (sum, [, data]) => sum + data.revenue,
        0,
      );

      categories.forEach(([category, data], index) => {
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        doc
          .rect(50, rowY - 3, 460, 22)
          .fill(bgColor)
          .stroke('#e5e7eb');

        const percentage = ((data.revenue / totalRevenue) * 100).toFixed(1);

        // Barra de porcentaje visual
        const barWidth = (Number.parseFloat(percentage) / 100) * 60;
        doc
          .rect(
            60 + colWidths[0] + colWidths[1] + colWidths[2] + 85,
            rowY + 6,
            barWidth,
            8,
          )
          .fill(primaryColor);

        doc
          .fillColor('#374151')
          .fontSize(10)
          .font('Helvetica')
          .text(category, 60, rowY, { width: colWidths[0] - 10 })
          .text(data.productsSold.toString(), 60 + colWidths[0], rowY)
          .text(
            `$${data.revenue.toLocaleString()}`,
            60 + colWidths[0] + colWidths[1],
            rowY,
          )
          .text(
            `${percentage}%`,
            60 + colWidths[0] + colWidths[1] + colWidths[2],
            rowY,
          );

        rowY += 22;
      });

      doc.y = rowY + 20;
    }
  }

  private addEnhancedEmployeeAnalysis(
    doc: any,
    salesByEmployee: Record<string, any>,
    primaryColor: string,
  ) {
    this.addSectionTitle(doc, 'RENDIMIENTO POR EMPLEADO', primaryColor);

    const employees = Object.entries(salesByEmployee)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 10);

    if (employees.length > 0) {
      const tableY = doc.y;
      const colWidths = [180, 80, 120, 100];

      // Header
      doc.rect(50, tableY, 480, 25).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Empleado', 60, tableY + 7)
        .text('Ventas', 60 + colWidths[0], tableY + 7)
        .text('Ingresos', 60 + colWidths[0] + colWidths[1], tableY + 7)
        .text(
          'Promedio',
          60 + colWidths[0] + colWidths[1] + colWidths[2],
          tableY + 7,
        );

      let rowY = tableY + 30;
      employees.forEach(([employee, data], index) => {
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        doc
          .rect(50, rowY - 3, 480, 22)
          .fill(bgColor)
          .stroke('#e5e7eb');

        const average =
          data.salesCount > 0
            ? (data.revenue / data.salesCount).toFixed(2)
            : '0.00';

        // Medalla para top 3
        if (index < 3) {
          const medalColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
          doc.circle(65, rowY + 8, 8).fill(medalColors[index]);
          doc
            .fillColor('#ffffff')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text((index + 1).toString(), 62, rowY + 5);
        }

        let employeeName = employee;
        if (employeeName.length > 25) {
          employeeName = employeeName.substring(0, 22) + '...';
        }

        doc
          .fillColor('#374151')
          .fontSize(10)
          .font('Helvetica')
          .text(employeeName, index < 3 ? 80 : 60, rowY, {
            width: colWidths[0] - (index < 3 ? 30 : 10),
          })
          .text(data.salesCount.toString(), 60 + colWidths[0], rowY)
          .text(
            `$${data.revenue.toLocaleString()}`,
            60 + colWidths[0] + colWidths[1],
            rowY,
          )
          .text(
            `$${average}`,
            60 + colWidths[0] + colWidths[1] + colWidths[2],
            rowY,
          );

        rowY += 22;
      });

      doc.y = rowY + 20;
    }
  }

  private addEnhancedGeographicAnalysis(
    doc: any,
    salesByCity: Record<string, any>,
    primaryColor: string,
  ) {
    this.addSectionTitle(
      doc,
      'ANÁLISIS GEOGRÁFICO - VENTAS POR CIUDAD',
      primaryColor,
    );

    const cities = Object.entries(salesByCity)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 15);

    if (cities.length > 0) {
      const tableY = doc.y;
      const colWidths = [160, 80, 120, 100];

      // Header
      doc.rect(50, tableY, 460, 25).fill(primaryColor);
      doc
        .fillColor('#ffffff')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Ciudad', 60, tableY + 7)
        .text('Ventas', 60 + colWidths[0], tableY + 7)
        .text('Ingresos', 60 + colWidths[0] + colWidths[1], tableY + 7)
        .text(
          'Productos',
          60 + colWidths[0] + colWidths[1] + colWidths[2],
          tableY + 7,
        );

      let rowY = tableY + 30;
      cities.forEach(([city, data], index) => {
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        doc
          .rect(50, rowY - 3, 460, 22)
          .fill(bgColor)
          .stroke('#e5e7eb');

        doc
          .fillColor('#374151')
          .fontSize(10)
          .font('Helvetica')
          .text(city, 60, rowY, { width: colWidths[0] - 10 })
          .text(data.salesCount.toString(), 60 + colWidths[0], rowY)
          .text(
            `$${data.revenue.toLocaleString()}`,
            60 + colWidths[0] + colWidths[1],
            rowY,
          )
          .text(
            data.productsSold.toString(),
            60 + colWidths[0] + colWidths[1] + colWidths[2],
            rowY,
          );

        rowY += 22;
      });

      doc.y = rowY + 20;
    }
  }

  private addEnhancedBrandGenderAnalysis(
    doc: any,
    salesByBrand: Record<string, any>,
    salesByGender: Record<string, any>,
    primaryColor: string,
  ) {
    // Análisis por marca
    this.addSectionTitle(doc, 'VENTAS POR MARCA', primaryColor);

    const brands = Object.entries(salesByBrand)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 8);

    if (brands.length > 0) {
      let currentY = doc.y;
      brands.forEach(([brand, data], index) => {
        // Punto de lista con color
        doc.circle(60, currentY + 6, 3).fill(primaryColor);

        doc
          .fillColor('#374151')
          .fontSize(11)
          .font('Helvetica')
          .text(
            `${brand}: ${data.productsSold} productos - $${data.revenue.toLocaleString()}`,
            70,
            currentY,
          );
        currentY += 18;
      });
      doc.y = currentY + 15;
    }

    // Análisis por género
    this.addSectionTitle(doc, 'VENTAS POR GÉNERO', primaryColor);

    const genders = Object.entries(salesByGender).sort(
      ([, a], [, b]) => b.revenue - a.revenue,
    );

    if (genders.length > 0) {
      let currentY = doc.y;
      genders.forEach(([gender, data], index) => {
        // Punto de lista con color
        doc.circle(60, currentY + 6, 3).fill(primaryColor);

        doc
          .fillColor('#374151')
          .fontSize(11)
          .font('Helvetica')
          .text(
            `${gender}: ${data.productsSold} productos - $${data.revenue.toLocaleString()}`,
            70,
            currentY,
          );
        currentY += 18;
      });
      doc.y = currentY + 15;
    }
  }

  private addEnhancedSalesDetails(
    doc: any,
    rawSales: any[],
    primaryColor: string,
  ) {
    this.addSectionTitle(doc, 'DETALLE DE VENTAS RECIENTES', primaryColor);

    const recentSales = rawSales.slice(0, 20);
    recentSales.forEach((sale, index) => {
      if (doc.y > 700) {
        doc.addPage();
      }

      // Caja para cada venta
      const boxY = doc.y;
      doc.rect(50, boxY, 495, 80).fill('#f8fafc').stroke('#e2e8f0');

      // Encabezado de venta
      doc
        .fillColor(primaryColor)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(`Venta #${sale.saleReference}`, 60, boxY + 10);

      // Información de la venta en dos columnas
      doc
        .fillColor('#374151')
        .fontSize(9)
        .font('Helvetica')
        .text(
          `Cliente: ${sale.user?.name || ''} ${sale.user?.surname || ''}`,
          60,
          boxY + 25,
        )
        .text(
          `Empleado: ${sale.employee?.name || ''} ${sale.employee?.surname || ''}`,
          280,
          boxY + 25,
        )
        .text(
          `Fecha: ${sale.createdAt.toLocaleDateString('es-ES')}`,
          60,
          boxY + 40,
        )
        .text(`Ciudad: ${sale.address?.city || 'N/A'}`, 280, boxY + 40)
        .text(
          `Total: $${Number(sale.totalAmount).toLocaleString()}`,
          60,
          boxY + 55,
        )
        .text(`Productos: ${sale.saleDetails.length}`, 280, boxY + 55);

      doc.y = boxY + 90;

      // Detalles de productos en formato compacto
      sale.saleDetails.forEach((detail: any) => {
        const variant = detail.productVariant;
        doc
          .fillColor('#6b7280')
          .fontSize(8)
          .font('Helvetica')
          .text(
            `  • ${variant.product.name} (${variant.color.name}/${variant.size.name}) - Cant: ${detail.quantity} - $${detail.unitPrice} c/u = $${detail.totalPrice}`,
            60,
            doc.y,
          );
        doc.y += 12;
      });

      doc.y += 10;
    });

    if (rawSales.length > 20) {
      doc
        .fillColor('#6b7280')
        .fontSize(10)
        .font('Helvetica-Oblique')
        .text(`... y ${rawSales.length - 20} ventas adicionales`, 50, doc.y);
    }
  }

  private addSectionTitle(doc: any, title: string, primaryColor: string) {
    // Línea decorativa antes del título
    doc
      .moveTo(50, doc.y)
      .lineTo(100, doc.y)
      .strokeColor(primaryColor)
      .lineWidth(3)
      .stroke();

    doc
      .fillColor('#1f2937')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(title, 50, doc.y + 10);

    doc.y += 40;
  }
}
