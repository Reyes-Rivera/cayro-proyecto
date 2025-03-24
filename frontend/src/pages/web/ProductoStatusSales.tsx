"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Search,
  RefreshCw,
  Filter,
  Palette,
  Ruler,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
} from "lucide-react";

// Importar math.js al inicio del archivo, justo después de los imports de React
import * as math from "mathjs";

// Tipos de datos
interface Size {
  id: number;
  name: string;
}

interface Color {
  id: number;
  name: string;
  hexValue: string;
}

interface ProductVariant {
  id: number;
  productId: number;
  colorId: number;
  sizeId: number;
  price: number;
  stock: number;
  barcode: string;
  imageUrl: string;
  color: Color;
  size: Size;
  // Datos de ventas
  salesData: {
    lastWeek: number;
    lastMonth: number;
    total: number;
    history: { month: number; sales: number }[];
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  brandId: number;
  genderId: number;
  sleeveId: number;
  categoryId: number;
  variants: ProductVariant[];
  brand: {
    id: number;
    name: string;
  };
  gender: {
    id: number;
    name: string;
  };
  sleeve: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

// Datos de productos importados del JSON
import productsData from "./products-data";

// Datos de ventas estáticos para cada variante
const staticSalesData: Record<
  number,
  {
    lastWeek: number;
    lastMonth: number;
    total: number;
    history: { month: number; sales: number }[];
  }
> = {
  // POLO HOMBRE
  1: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  }, // Rojo vino - CH
  2: {
    lastWeek: 18,
    lastMonth: 65,
    total: 180,
    history: [
      { month: 0, sales: 15 },
      { month: 1, sales: 33 },
    ],
  }, // Rojo vino - G
  3: {
    lastWeek: 15,
    lastMonth: 55,
    total: 150,
    history: [
      { month: 0, sales: 13 },
      { month: 1, sales: 28 },
    ],
  }, // Rojo vino - MED
  4: {
    lastWeek: 8,
    lastMonth: 30,
    total: 85,
    history: [
      { month: 0, sales: 7 },
      { month: 1, sales: 15 },
    ],
  }, // Gris - CH
  5: {
    lastWeek: 6,
    lastMonth: 25,
    total: 70,
    history: [
      { month: 0, sales: 5 },
      { month: 1, sales: 11 },
    ],
  }, // Blanco - XG
  6: {
    lastWeek: 10,
    lastMonth: 40,
    total: 110,
    history: [
      { month: 0, sales: 9 },
      { month: 1, sales: 19 },
    ],
  }, // Blanco - MED
  7: {
    lastWeek: 20,
    lastMonth: 75,
    total: 200,
    history: [
      { month: 0, sales: 38 },
      { month: 1, sales: 55 },
    ],
  }, // Azul marino - CH
  8: {
    lastWeek: 16,
    lastMonth: 60,
    total: 165,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  }, // Azul marino - MED
  9: {
    lastWeek: 14,
    lastMonth: 50,
    total: 140,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  }, // Azul cielo - MED

  // POLO ACANALADO MUJER
  10: {
    lastWeek: 15,
    lastMonth: 55,
    total: 145,
    history: [
      { month: 0, sales: 13 },
      { month: 1, sales: 28 },
    ],
  }, // Negro - CH
  11: {
    lastWeek: 12,
    lastMonth: 45,
    total: 125,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  }, // Negro - MED
  12: {
    lastWeek: 18,
    lastMonth: 65,
    total: 175,
    history: [
      { month: 0, sales: 16 },
      { month: 1, sales: 34 },
    ],
  }, // Blanco - G
  13: {
    lastWeek: 14,
    lastMonth: 50,
    total: 135,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  }, // Blanco - CH
  14: {
    lastWeek: 10,
    lastMonth: 35,
    total: 95,
    history: [
      { month: 0, sales: 8 },
      { month: 1, sales: 18 },
    ],
  }, // Blanco - XCH
  15: {
    lastWeek: 16,
    lastMonth: 60,
    total: 155,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  }, // Azul cielo - G

  // PLAYERA HENLEY HOMBRE
  16: {
    lastWeek: 14,
    lastMonth: 50,
    total: 130,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  }, // Negro - G
  17: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  }, // Negro - CH
  18: {
    lastWeek: 10,
    lastMonth: 35,
    total: 95,
    history: [
      { month: 0, sales: 8 },
      { month: 1, sales: 18 },
    ],
  }, // Negro - MED
  19: {
    lastWeek: 8,
    lastMonth: 30,
    total: 80,
    history: [
      { month: 0, sales: 7 },
      { month: 1, sales: 15 },
    ],
  }, // Beige - CH

  // PLAYERA CUELLO V-HOMBRE
  20: {
    lastWeek: 16,
    lastMonth: 60,
    total: 155,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  }, // Rojo vino - CH
  21: {
    lastWeek: 14,
    lastMonth: 50,
    total: 135,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  }, // Rojo vino - MED
  22: {
    lastWeek: 6,
    lastMonth: 20,
    total: 55,
    history: [
      { month: 0, sales: 5 },
      { month: 1, sales: 11 },
    ],
  }, // Blanco - XCH
  23: {
    lastWeek: 8,
    lastMonth: 30,
    total: 80,
    history: [
      { month: 0, sales: 7 },
      { month: 1, sales: 15 },
    ],
  }, // Blanco - XG
  24: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  }, // Negro - MED
  25: {
    lastWeek: 10,
    lastMonth: 35,
    total: 95,
    history: [
      { month: 0, sales: 8 },
      { month: 1, sales: 18 },
    ],
  }, // Negro - CH
  26: {
    lastWeek: 18,
    lastMonth: 65,
    total: 170,
    history: [
      { month: 0, sales: 16 },
      { month: 1, sales: 34 },
    ],
  }, // Azul marino - MED
  27: {
    lastWeek: 20,
    lastMonth: 75,
    total: 190,
    history: [
      { month: 0, sales: 18 },
      { month: 1, sales: 38 },
    ],
  }, // Azul marino - CH
  28: {
    lastWeek: 16,
    lastMonth: 60,
    total: 155,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  }, // Azul marino - G
  29: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  }, // Azul marino - XCH
  30: {
    lastWeek: 10,
    lastMonth: 35,
    total: 95,
    history: [
      { month: 0, sales: 8 },
      { month: 1, sales: 18 },
    ],
  }, // Azul marino - XG

  // Resto de variantes
  31: {
    lastWeek: 14,
    lastMonth: 50,
    total: 130,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  },
  32: {
    lastWeek: 10,
    lastMonth: 35,
    total: 95,
    history: [
      { month: 0, sales: 8 },
      { month: 1, sales: 18 },
    ],
  },
  33: {
    lastWeek: 8,
    lastMonth: 30,
    total: 80,
    history: [
      { month: 0, sales: 7 },
      { month: 1, sales: 15 },
    ],
  },
  34: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  },
  35: {
    lastWeek: 16,
    lastMonth: 60,
    total: 155,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  },
  36: {
    lastWeek: 14,
    lastMonth: 50,
    total: 135,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  },
  37: {
    lastWeek: 18,
    lastMonth: 65,
    total: 170,
    history: [
      { month: 0, sales: 16 },
      { month: 1, sales: 34 },
    ],
  },
  38: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  },
  39: {
    lastWeek: 20,
    lastMonth: 75,
    total: 190,
    history: [
      { month: 0, sales: 18 },
      { month: 1, sales: 38 },
    ],
  },
  40: {
    lastWeek: 15,
    lastMonth: 55,
    total: 145,
    history: [
      { month: 0, sales: 13 },
      { month: 1, sales: 28 },
    ],
  },
  41: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  },
  42: {
    lastWeek: 10,
    lastMonth: 35,
    total: 95,
    history: [
      { month: 0, sales: 8 },
      { month: 1, sales: 18 },
    ],
  },
  43: {
    lastWeek: 14,
    lastMonth: 50,
    total: 135,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  },
  44: {
    lastWeek: 16,
    lastMonth: 60,
    total: 155,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  },
  45: {
    lastWeek: 8,
    lastMonth: 30,
    total: 80,
    history: [
      { month: 0, sales: 7 },
      { month: 1, sales: 15 },
    ],
  },
  46: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  },
  47: {
    lastWeek: 15,
    lastMonth: 55,
    total: 145,
    history: [
      { month: 0, sales: 13 },
      { month: 1, sales: 28 },
    ],
  },
  48: {
    lastWeek: 14,
    lastMonth: 50,
    total: 135,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  },
  49: {
    lastWeek: 18,
    lastMonth: 65,
    total: 170,
    history: [
      { month: 0, sales: 16 },
      { month: 1, sales: 34 },
    ],
  },
  50: {
    lastWeek: 16,
    lastMonth: 60,
    total: 155,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  },
  51: {
    lastWeek: 14,
    lastMonth: 50,
    total: 135,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  },
  52: {
    lastWeek: 20,
    lastMonth: 75,
    total: 190,
    history: [
      { month: 0, sales: 18 },
      { month: 1, sales: 38 },
    ],
  },
  53: {
    lastWeek: 12,
    lastMonth: 45,
    total: 120,
    history: [
      { month: 0, sales: 10 },
      { month: 1, sales: 22 },
    ],
  },
  54: {
    lastWeek: 16,
    lastMonth: 60,
    total: 155,
    history: [
      { month: 0, sales: 14 },
      { month: 1, sales: 30 },
    ],
  },
  55: {
    lastWeek: 14,
    lastMonth: 50,
    total: 135,
    history: [
      { month: 0, sales: 12 },
      { month: 1, sales: 26 },
    ],
  },
  56: {
    lastWeek: 18,
    lastMonth: 65,
    total: 170,
    history: [
      { month: 0, sales: 16 },
      { month: 1, sales: 34 },
    ],
  },
  57: {
    lastWeek: 15,
    lastMonth: 55,
    total: 145,
    history: [
      { month: 0, sales: 13 },
      { month: 1, sales: 28 },
    ],
  },
};

// Función para enriquecer los productos con datos de ventas estáticos
const enrichProductsWithSalesData = (products: Product[]): Product[] => {
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      // Aumentar el stock significativamente para ver el agotamiento en más semanas
      stock: variant.stock * 50, // Multiplicamos el stock por 50 para ver proyección a más largo plazo
      salesData: staticSalesData[variant.id] || {
        lastWeek: 10,
        lastMonth: 40,
        total: 100,
        history: [
          { month: 0, sales: 8 },
          { month: 1, sales: 10 },
        ],
      },
    })),
  }));
};

// Colores para gráficos
const CHART_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#D97706",
  "#059669",
  "#7C3AED",
];

// Reemplazar la función calculateGrowthRate con esta versión que usa math.js

export default function SalesAnalysisDashboard() {
  // Estado para los productos con datos de ventas
  const [products, setProducts] = useState<Product[]>([]);

  // Estados para filtros y selecciones
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Añadir un estado para alternar entre vista semanal y anual
  const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly");

  // Cargar y enriquecer datos al inicio
  useEffect(() => {
    // Simular carga de datos
    setIsLoading(true);
    setTimeout(() => {
      const enrichedProducts = enrichProductsWithSalesData(
        productsData as unknown as Product[]
      );
      setProducts(enrichedProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Producto seleccionado
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // Variantes filtradas por color y talla
  const filteredVariants = useMemo(() => {
    if (!selectedProduct) return [];

    return selectedProduct.variants.filter((variant) => {
      const matchesColor = selectedColorId
        ? variant.colorId === selectedColorId
        : true;
      const matchesSize = selectedSizeId
        ? variant.sizeId === selectedSizeId
        : true;
      return matchesColor && matchesSize;
    });
  }, [selectedProduct, selectedColorId, selectedSizeId]);

  // Variante seleccionada
  const selectedVariant = useMemo(() => {
    if (!selectedVariantId || !selectedProduct) return null;
    return (
      selectedProduct.variants.find((v) => v.id === selectedVariantId) || null
    );
  }, [selectedProduct, selectedVariantId]);

  // Colores disponibles para el producto seleccionado
  const availableColors = useMemo(() => {
    if (!selectedProduct) return [];

    const colorMap = new Map<number, Color>();
    selectedProduct.variants.forEach((variant) => {
      if (!colorMap.has(variant.colorId)) {
        colorMap.set(variant.colorId, variant.color);
      }
    });

    return Array.from(colorMap.values());
  }, [selectedProduct]);

  // Tallas disponibles para el producto seleccionado
  const availableSizes = useMemo(() => {
    if (!selectedProduct) return [];

    const sizeMap = new Map<number, Size>();
    selectedProduct.variants.forEach((variant) => {
      if (!sizeMap.has(variant.sizeId)) {
        sizeMap.set(variant.sizeId, variant.size);
      }
    });

    return Array.from(sizeMap.values());
  }, [selectedProduct]);

  // Datos para el gráfico de ventas por color
  const salesByColorData = useMemo(() => {
    if (!selectedProduct) return [];

    const colorSalesMap = new Map<
      number,
      { colorId: number; colorName: string; hexValue: string; sales: number }
    >();

    selectedProduct.variants.forEach((variant) => {
      if (!colorSalesMap.has(variant.colorId)) {
        colorSalesMap.set(variant.colorId, {
          colorId: variant.colorId,
          colorName: variant.color.name,
          hexValue: variant.color.hexValue,
          sales: 0,
        });
      }

      const colorData = colorSalesMap.get(variant.colorId)!;
      colorData.sales += variant.salesData?.total || 0;
    });

    return Array.from(colorSalesMap.values()).sort((a, b) => b.sales - a.sales);
  }, [selectedProduct]);

  // Datos para el gráfico de ventas por talla
  const salesBySizeData = useMemo(() => {
    if (!selectedProduct) return [];

    const sizeSalesMap = new Map<
      number,
      { sizeId: number; sizeName: string; sales: number }
    >();

    selectedProduct.variants.forEach((variant) => {
      if (!sizeSalesMap.has(variant.sizeId)) {
        sizeSalesMap.set(variant.sizeId, {
          sizeId: variant.sizeId,
          sizeName: variant.size.name,
          sales: 0,
        });
      }

      const sizeData = sizeSalesMap.get(variant.sizeId)!;
      sizeData.sales += variant.salesData?.total || 0;
    });

    return Array.from(sizeSalesMap.values()).sort((a, b) => b.sales - a.sales);
  }, [selectedProduct]);

  // Add a function to get month names
  const getMonthName = (monthIndex: number) => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    return monthNames[monthIndex % 12];
  };

  // Replace getDateForWeek with getDateForMonth
  const getDateForMonth = (month: number) => {
    // For month 0 (January) and month 1 (February), return specific dates
    if (month === 0) {
      return "31/01/2025"; // January (month 0)
    } else if (month === 1) {
      return "28/02/2025"; // February (month 1)
    }

    // For other months, calculate based on February
    const baseDate = new Date(2024, 1, 29); // February 29, 2024
    const targetDate = new Date(baseDate);
    targetDate.setMonth(baseDate.getMonth() + (month - 1));

    // Get last day of the month
    const lastDay = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0
    ).getDate();
    targetDate.setDate(lastDay);

    return targetDate.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Reemplazar la función salesProjectionData con esta versión que usa math.js
  const calculateGrowthRate = (history: { month: number; sales: number }[]) => {
    if (history.length < 2) return 0.05; // Default rate
    const firstMonth = history[0];
    const secondMonth = history[1];

    if (firstMonth.sales <= 0) return 0.05;

    // Calculate the growth rate using the formula k = ln(P(t2)/P(t1)) / (t2 - t1)
    const timeElapsed = secondMonth.month - firstMonth.month;
    const growthRate =
      Math.log(secondMonth.sales / firstMonth.sales) / timeElapsed;

    // Redondear a 4 decimales usando toFixed()
    const roundedGrowthRate = Number(growthRate.toFixed(4));
    // Limit the rate between -0.1 and 0.2
    return roundedGrowthRate;
  };
  const salesProjectionData = useMemo(() => {
    if (!selectedVariant || !selectedVariant.salesData) return [];

    const history = selectedVariant.salesData.history;
    const initialSales = history[history.length - 1].sales;
    const growthRate = calculateGrowthRate(history);
    // Histórico con ventas mensuales y acumuladas
    const historyWithCumulative = history.map((entry, index) => ({
      month: entry.month,
      monthName: getMonthName(entry.month),
      cumulativeSales: entry.sales,
      sales: index === 0 ? entry.sales : entry.sales - history[index - 1].sales,
      isHistorical: true,
    }));

    const projection = [];
    let previousCumulativeSales = initialSales;

    for (let i = 0; i < 10; i++) {
      const month = history.length + i;
      const timeElapsed = i + 1;

      // Aplicar la fórmula p = ce^(kt) usando math.js
      const projectedCumulativeSales = math.round(
        math.multiply(
          initialSales,
          math.exp(math.multiply(growthRate, timeElapsed))
        )
      );

      const monthlySales = projectedCumulativeSales - previousCumulativeSales;

      projection.push({
        month,
        monthName: getMonthName(month),
        sales: monthlySales,
        cumulativeSales: projectedCumulativeSales,
        isHistorical: false,
      });

      previousCumulativeSales = projectedCumulativeSales;
    }

    return [...historyWithCumulative, ...projection];
  }, [selectedVariant]);

  // Update calculateStockOutWeek to calculateStockOutMonth
  const calculateStockOutMonth = useMemo(() => {
    if (!selectedVariant || !selectedVariant.salesData) return null;

    const projectionData = salesProjectionData;
    const remainingStock = selectedVariant.stock;
    let cumulativeSalesFromMarch = 0;

    for (let i = 0; i < projectionData.length; i++) {
      // Only count sales from March (month index 2) onwards for stock reduction
      if (projectionData[i].month >= 2) {
        cumulativeSalesFromMarch += projectionData[i].sales;
      }

      // Check if cumulative sales from March onwards exceed the stock
      if (cumulativeSalesFromMarch >= remainingStock) {
        return {
          month: projectionData[i].month,
          monthName: projectionData[i].monthName,
          date: getDateForMonth(projectionData[i].month),
        };
      }
    }

    return null;
  }, [selectedVariant, salesProjectionData]);

  // Añadir función para calcular datos anuales
  const annualProjectionData = useMemo(() => {
    if (!selectedVariant || !selectedVariant.salesData) return [];

    // Agrupar datos semanales por año
    const weeklyData = salesProjectionData;
    const annualData = [];

    // Obtener el año actual
    const currentYear = new Date().getFullYear();

    // Calcular datos para el año actual (semanas históricas)
    const currentYearHistorical = {
      year: currentYear,
      sales: weeklyData
        .filter((w) => w.month <= 11)
        .reduce((sum, w) => sum + w.sales, 0),
      isHistorical: true,
    };

    // Calcular datos para el año siguiente (proyección)
    const nextYearTotal = {
      year: currentYear + 1,
      sales: weeklyData
        .filter((w) => {
          const date = new Date();
          date.setDate(date.getDate() + (w.month - 1) * 30);
          return date.getFullYear() === currentYear + 1;
        })
        .reduce((sum, w) => sum + w.sales, 0),
      isHistorical: false,
    };

    annualData.push(currentYearHistorical, nextYearTotal);

    return annualData;
  }, [selectedVariant, salesProjectionData]);

  // Manejar cambio de producto
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(Number(e.target.value));
    setSelectedColorId(null);
    setSelectedSizeId(null);
    setSelectedVariantId(null);
  };

  // Manejar cambio de color
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedColorId(value === "all" ? null : Number(value));
    setSelectedVariantId(null);
  };

  // Manejar cambio de talla
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSizeId(value === "all" ? null : Number(value));
    setSelectedVariantId(null);
  };

  // Añadir un useEffect para cambiar a la pestaña de proyección cuando se selecciona una variante
  useEffect(() => {
    if (selectedVariantId) {
      setActiveTab("projection");
    }
  }, [selectedVariantId]);

  // Modificar la función handleVariantSelect para incluir el cambio de pestaña
  const handleVariantSelect = (variantId: number) => {
    setSelectedVariantId(variantId);
    setActiveTab("projection");
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSelectedColorId(null);
    setSelectedSizeId(null);
  };

  // Función para renderizar el indicador de crecimiento
  const renderGrowthIndicator = (growthRate: number | null) => {
    if (growthRate === null) return <span className="text-gray-500">-</span>;

    if (growthRate > 0) {
      return (
        <div className="flex items-center gap-1 text-emerald-600 font-medium">
          <ArrowUpRight size={16} />+{growthRate.toFixed(1)}%
        </div>
      );
    } else if (growthRate < 0) {
      return (
        <div className="flex items-center gap-1 text-rose-600 font-medium">
          <ArrowDownRight size={16} />
          {growthRate.toFixed(1)}%
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <Minus size={16} />
          0%
        </div>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-14">
      {/* Encabezado */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 md:items-center">
            <div className="bg-white/20 p-4 rounded-lg">
              <BarChart3 size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold m-0">
                Análisis de Ventas por Talla y Color
              </h1>
              <p className="mt-1 text-white/90">
                Analiza qué tallas y colores se venden más y realiza
                proyecciones de inventario por mes
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Modelo Exponencial dP/dt=kP
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Proyección a 10 Meses
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  Análisis de Agotamiento
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Selector de producto */}
      <section className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-slate-50 p-4 md:p-6 rounded-t-lg">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold m-0">Seleccionar Producto</h2>
          </div>
          <p className="text-gray-500 text-sm mt-1 mb-0">
            Elige un producto para analizar sus ventas por talla y color
          </p>
        </div>
        <div className="p-6">
          <select
            value={selectedProductId?.toString() || ""}
            onChange={handleProductChange}
            className="w-full max-w-md px-3.5 py-2.5 rounded-lg border border-gray-300 text-base"
          >
            <option value="">Selecciona un producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id.toString()}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {selectedProduct && (
        <div className="mb-6">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === "overview"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-gray-800"
              } border-none rounded-t-lg cursor-pointer font-${
                activeTab === "overview" ? "semibold" : "normal"
              } mr-1`}
            >
              <PieChartIcon size={16} />
              <span>Resumen</span>
            </button>
            <button
              onClick={() => setActiveTab("variants")}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === "variants"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-gray-800"
              } border-none rounded-t-lg cursor-pointer font-${
                activeTab === "variants" ? "semibold" : "normal"
              } mr-1`}
            >
              <Palette size={16} />
              <span>Variantes</span>
            </button>
            <button
              onClick={() => setActiveTab("projection")}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === "projection"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-100 text-gray-800"
              } border-none rounded-t-lg cursor-pointer font-${
                activeTab === "projection" ? "semibold" : "normal"
              }`}
            >
              <TrendingUp size={16} />
              <span>Proyección</span>
            </button>
          </div>

          {/* Pestaña de Resumen */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gráfico de ventas por color */}
                <section className="bg-white rounded-lg shadow-md">
                  <div className="bg-slate-50 p-4 md:p-6 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <Palette size={20} className="text-blue-500" />
                      <h2 className="text-lg font-semibold m-0">
                        Ventas por Color
                      </h2>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 mb-0">
                      Distribución de ventas según el color del producto
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={salesByColorData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="colorName"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis />
                          <Tooltip
                            formatter={(value: any) => [
                              `${value} unidades`,
                              "Ventas",
                            ]}
                            labelFormatter={(label: any) => `Color: ${label}`}
                            contentStyle={{
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              border: "none",
                            }}
                          />
                          <Bar dataKey="sales" name="Ventas">
                            {salesByColorData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.hexValue ||
                                  CHART_COLORS[index % CHART_COLORS.length]
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>

                {/* Gráfico de ventas por talla */}
                <section className="bg-white rounded-lg shadow-md">
                  <div className="bg-slate-50 p-4 md:p-6 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <Ruler size={20} className="text-blue-500" />
                      <h2 className="text-lg font-semibold m-0">
                        Ventas por Talla
                      </h2>
                    </div>
                    <p className="text-gray-500 text-sm mt-1 mb-0">
                      Distribución de ventas según la talla del producto
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={salesBySizeData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sizeName" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: any) => [
                              `${value} unidades`,
                              "Ventas",
                            ]}
                            labelFormatter={(label: any) => `Talla: ${label}`}
                            contentStyle={{
                              backgroundColor: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                              border: "none",
                            }}
                          />
                          <Bar dataKey="sales" name="Ventas" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>
              </div>

              {/* Gráfico de distribución combinada */}
              <section className="bg-white rounded-lg shadow-md border-t-4 border-indigo-600">
                <div className="bg-indigo-50 p-4 md:p-6 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <PieChartIcon size={20} className="text-indigo-600" />
                    <h2 className="text-lg font-semibold m-0">
                      Distribución de Ventas
                    </h2>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 mb-0">
                    Visualización de las combinaciones más vendidas de talla y
                    color
                  </p>
                </div>
                <div className="p-4">
                  <div className="h-[400px] bg-gradient-to-br from-white to-indigo-50 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={selectedProduct.variants.map((v) => ({
                            id: v.id,
                            name: `${v.color.name} - ${v.size.name}`,
                            value: v.salesData?.total || 0,
                            color: v.color.hexValue,
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({
                            name,
                            percent,
                          }: {
                            name: string;
                            percent: number;
                          }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {selectedProduct.variants.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.color.hexValue ||
                                CHART_COLORS[index % CHART_COLORS.length]
                              }
                              stroke="#333"
                              strokeWidth={
                                entry.color.hexValue === "#FFFFFF" ||
                                entry.color.hexValue === "#FFF" ||
                                entry.color.name.toLowerCase() === "blanco"
                                  ? 1
                                  : 0
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [
                            `${value} unidades`,
                            "Ventas",
                          ]}
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            border: "none",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              {/* Tabla de mejores combinaciones */}
              <section className="bg-white rounded-lg shadow-md">
                <div className="bg-slate-50 p-4 md:p-6 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-500" />
                    <h2 className="text-lg font-semibold m-0">
                      Top Combinaciones
                    </h2>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 mb-0">
                    Las combinaciones de talla y color más vendidas
                  </p>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Posición
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Imagen
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Color
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Talla
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Ventas Totales
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Stock Actual
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProduct.variants
                        .sort(
                          (a, b) =>
                            (b.salesData?.total || 0) -
                            (a.salesData?.total || 0)
                        )
                        .slice(0, 10)
                        .map((variant, index) => (
                          <tr
                            key={variant.id}
                            className={`${
                              selectedVariantId === variant.id
                                ? "bg-blue-50"
                                : ""
                            } transition-colors`}
                          >
                            <td className="p-3 border-b border-gray-200 font-medium">
                              {index + 1}
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              <img
                                src={variant.imageUrl || "/placeholder.svg"}
                                alt={`${selectedProduct.name} - ${variant.color.name}`}
                                className="w-12 h-12 object-contain border border-gray-200 rounded-md"
                              />
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: variant.color.hexValue,
                                  }}
                                />
                                {variant.color.name}
                              </div>
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              {variant.size.name}
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              {variant.salesData?.total || 0} unidades
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-sm ${
                                  variant.stock < 5
                                    ? "bg-red-100 text-red-700 border border-red-200"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                                }`}
                              >
                                {variant.stock} unidades
                              </span>
                            </td>
                            <td className="p-3 border-b border-gray-200">
                              <button
                                onClick={() => handleVariantSelect(variant.id)}
                                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm cursor-pointer"
                              >
                                Seleccionar
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Pestaña de Variantes */}
          {activeTab === "variants" && (
            <div className="flex flex-col gap-4">
              <section className="bg-white rounded-lg shadow-md">
                <div className="bg-slate-50 p-4 md:p-6 rounded-t-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-blue-500" />
                    <h2 className="text-lg font-semibold m-0">
                      Filtrar Variantes
                    </h2>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm cursor-pointer"
                  >
                    Limpiar Filtros
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Color
                      </label>
                      <select
                        value={selectedColorId?.toString() || "all"}
                        onChange={handleColorChange}
                        className="w-full px-3.5 py-2.5 rounded-md border border-gray-300 text-base"
                      >
                        <option value="all">Todos los colores</option>
                        {availableColors.map((color) => (
                          <option key={color.id} value={color.id.toString()}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Talla
                      </label>
                      <select
                        value={selectedSizeId?.toString() || "all"}
                        onChange={handleSizeChange}
                        className="w-full px-3.5 py-2.5 rounded-md border border-gray-300 text-base"
                      >
                        <option value="all">Todas las tallas</option>
                        {availableSizes.map((size) => (
                          <option key={size.id} value={size.id.toString()}>
                            {size.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-lg shadow-md">
                <div className="bg-slate-50 p-4 md:p-6 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={20} className="text-blue-500" />
                    <h2 className="text-lg font-semibold m-0">
                      Variantes del Producto
                    </h2>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 mb-0">
                    {filteredVariants.length} variantes encontradas
                  </p>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Imagen
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          ID
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Color
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Talla
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Precio
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Stock
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Ventas
                        </th>
                        <th className="p-3 text-left font-semibold border-b border-gray-200">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVariants.map((variant) => (
                        <tr
                          key={variant.id}
                          className={`${
                            selectedVariantId === variant.id ? "bg-blue-50" : ""
                          } transition-colors`}
                        >
                          <td className="p-3 border-b border-gray-200">
                            <img
                              src={variant.imageUrl || "/placeholder.svg"}
                              alt={`${selectedProduct.name} - ${variant.color.name}`}
                              className="w-12 h-12 object-contain border border-gray-200 rounded-md"
                            />
                          </td>
                          <td className="p-3 border-b border-gray-200 font-mono text-sm">
                            {variant.id}
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor: variant.color.hexValue,
                                }}
                              />
                              {variant.color.name}
                            </div>
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            {variant.size.name}
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            ${variant.price}
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-sm ${
                                variant.stock < 5
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {variant.stock} unidades
                            </span>
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            <div className="font-medium">
                              {variant.salesData?.total || 0} unidades
                            </div>
                            <div className="text-xs text-gray-500">
                              Último mes: {variant.salesData?.lastMonth || 0}
                            </div>
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            <button
                              onClick={() => handleVariantSelect(variant.id)}
                              className={`px-3 py-1.5 rounded-md border border-gray-300 ${
                                selectedVariantId === variant.id
                                  ? "bg-blue-500 text-white"
                                  : "bg-white text-gray-700"
                              } text-sm cursor-pointer`}
                            >
                              {selectedVariantId === variant.id
                                ? "Seleccionado"
                                : "Seleccionar"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Pestaña de Proyección */}
          {activeTab === "projection" && (
            <div className="flex flex-col gap-4">
              {selectedVariant ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Variante seleccionada */}
                    <section className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-blue-50 p-4 md:p-6">
                        <h2 className="text-lg font-semibold m-0 text-blue-800">
                          Variante Seleccionada
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col items-center gap-4">
                            <img
                              src={
                                selectedVariant.imageUrl || "/placeholder.svg"
                              }
                              alt={`${selectedProduct.name} - ${selectedVariant.color.name}`}
                              className="w-32 h-32 object-contain border border-gray-200 rounded-lg shadow-sm"
                            />
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full border border-gray-300"
                                style={{
                                  backgroundColor:
                                    selectedVariant.color.hexValue,
                                }}
                              />
                              <span className="font-medium">
                                {selectedProduct.name}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Color</div>
                              <div className="font-medium">
                                {selectedVariant.color.name}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Talla</div>
                              <div className="font-medium">
                                {selectedVariant.size.name}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">
                                Precio
                              </div>
                              <div className="font-medium">
                                ${selectedVariant.price}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Stock</div>
                              <div className="font-medium">
                                {selectedVariant.stock} unidades
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Ventas actuales */}
                    <section className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-green-50 p-4 md:p-6">
                        <h2 className="text-lg font-semibold m-0 text-green-800">
                          Ventas Actuales
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">
                              Última Semana
                            </div>
                            <div className="text-2xl font-bold">
                              {selectedVariant.salesData?.lastWeek || 0}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">
                              Último Mes
                            </div>
                            <div className="text-2xl font-bold">
                              {selectedVariant.salesData?.lastMonth || 0}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-sm text-gray-500">
                              Total Vendido
                            </div>
                            <div className="text-2xl font-bold">
                              {selectedVariant.salesData?.total || 0} unidades
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Modelo de proyección */}
                    <section className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="bg-amber-50 p-4 md:p-6">
                        <h2 className="text-lg font-semibold m-0 text-amber-800">
                          Modelo de Proyección
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-col gap-4">
                          <div>
                            <div className="text-sm text-gray-500">
                              Modelo Matemático
                            </div>
                            <div className="text-lg font-medium">
                              P = c × e<sup>kt</sup>{" "}
                              <span className="text-xs text-gray-500">
                                (calculado con math.js)
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Donde P = Ventas totales, c = ventas iniciales, k
                              = tasa de crecimiento, t = tiempo
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500">
                              Condición Inicial (c)
                            </div>
                            <div className="text-xl font-bold">
                              {
                                selectedVariant.salesData?.history[
                                  selectedVariant.salesData.history.length - 1
                                ].sales
                              }{" "}
                              unidades
                            </div>
                            <div className="text-sm text-gray-500">
                              Ventas en el último mes registrado (Febrero)
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-500">
                              Constante de Proporcionalidad (k)
                            </div>
                            <div className="text-xl font-bold">
                              {(
                                calculateGrowthRate(
                                  selectedVariant.salesData?.history || []
                                ) * 100
                              ).toFixed(1)}
                              % mensual
                            </div>
                            <div className="text-sm text-gray-500">
                              Tasa de crecimiento exponencial
                            </div>
                          </div>

                          {calculateStockOutMonth ? (
                            <div>
                              <div className="text-sm text-gray-500">
                                Agotamiento Estimado
                              </div>
                              <div className="text-xl font-bold">
                                {calculateStockOutMonth.monthName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {calculateStockOutMonth.date}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-sm text-gray-500">
                                Agotamiento Estimado
                              </div>
                              <div className="text-xl font-bold text-green-600">
                                No se agotará en 10 meses
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Historial de ventas mejorado */}
                  <section className="bg-white rounded-lg shadow-md border-t-4 border-green-500">
                    <div className="bg-green-50 p-4 md:p-6 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={20} className="text-green-600" />
                        <h2 className="text-lg font-semibold m-0">
                          Historial de Ventas
                        </h2>
                      </div>
                      <div className="relative">
                        <button
                          className="bg-transparent border-none cursor-pointer flex items-center"
                          title="Datos históricos de ventas para Enero (mes base) y Febrero (mes actual)"
                        >
                          <Info size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-500 text-sm m-0 mb-4">
                        Datos históricos de ventas mensuales (Enero y Febrero)
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead className="bg-green-50/50">
                            <tr>
                              <th className="p-3 text-left font-bold border-b border-gray-200">
                                Parámetro
                              </th>
                              <th className="p-3 text-left font-bold border-b border-gray-200">
                                Mes
                              </th>
                              <th className="p-3 text-left font-bold border-b border-gray-200">
                                Fecha
                              </th>
                              <th className="p-3 text-left font-bold border-b border-gray-200">
                                Ventas
                              </th>
                              <th className="p-3 text-left font-bold border-b border-gray-200">
                                Crecimiento
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedVariant.salesData?.history.map(
                              (month, index) => {
                                const prevMonth =
                                  index > 0
                                    ? selectedVariant.salesData?.history[
                                        index - 1
                                      ].sales
                                    : null;
                                const growthRate = prevMonth
                                  ? ((month.sales - prevMonth) / prevMonth) *
                                    100
                                  : null;

                                return (
                                  <tr
                                    key={month.month}
                                    className={`${
                                      index === 0
                                        ? "bg-green-50/30"
                                        : "bg-blue-50/30"
                                    }`}
                                  >
                                    <td className="p-3 border-b border-gray-200 font-medium">
                                      {index === 0
                                        ? "Mes base"
                                        : "Ultimas ventas"}
                                    </td>
                                    <td className="p-3 border-b border-gray-200">
                                      {getMonthName(month.month)}
                                    </td>
                                    <td className="p-3 border-b border-gray-200 font-medium">
                                      {getDateForMonth(month.month)}
                                    </td>
                                    <td className="p-3 border-b border-gray-200 font-bold">
                                      {month.sales} unidades
                                    </td>
                                    <td className="p-3 border-b border-gray-200">
                                      {renderGrowthIndicator(growthRate)}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 md:p-6 rounded-b-lg text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          Proyecciones basadas en datos históricos de Enero y
                          Febrero 2024
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Gráfico de proyección mejorado */}
                  <section className="bg-white rounded-lg shadow-md border-t-4 border-blue-500">
                    <div className="bg-blue-50 p-4 md:p-6 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <LineChartIcon size={20} className="text-blue-500" />
                        <h2 className="text-lg font-semibold m-0">
                          Proyección de Ventas
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Histórico (Ene - Feb)
                        </span>
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          Proyección
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salesProjectionData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 10,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="monthName"
                              label={{
                                value: "Mes",
                                position: "insideBottomRight",
                                offset: -10,
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Unidades Acumuladas",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <Tooltip
                              formatter={(value: any, name: string) => {
                                if (name.includes("Acumuladas")) {
                                  return [`${value} unidades`, name];
                                }
                                return [
                                  `${value} unidades`,
                                  "Ventas Mensuales",
                                ];
                              }}
                              labelFormatter={(label: any) => {
                                return `${label}`;
                              }}
                              contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                border: "none",
                              }}
                            />
                            <Legend verticalAlign="top" height={36} />

                            {/* Datos históricos acumulados */}
                            <Line
                              type="monotone"
                              dataKey={(entry: {
                                month: number;
                                cumulativeSales: any;
                                isHistorical: boolean;
                              }) =>
                                entry.isHistorical
                                  ? entry.cumulativeSales
                                  : null
                              }
                              name="Ventas totales Históricas"
                              stroke="#3B82F6"
                              strokeWidth={3}
                              dot={{ r: 4, fill: "#3B82F6" }}
                              activeDot={{ r: 8 }}
                            />

                            {/* Datos proyectados acumulados */}
                            <Line
                              type="monotone"
                              dataKey={(entry: {
                                month: number;
                                cumulativeSales: any;
                                isHistorical: boolean;
                              }) =>
                                !entry.isHistorical
                                  ? entry.cumulativeSales
                                  : null
                              }
                              name="Ventas totales Proyectadas"
                              stroke="#8B5CF6"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ r: 4, fill: "#8B5CF6" }}
                            />

                            {/* Línea que divide historial de proyección */}
                            <Line
                              type="monotone"
                              dataKey={(entry: {
                                month: number;
                                cumulativeSales: any;
                                monthName: string;
                              }) =>
                                entry.monthName === "Febrero"
                                  ? entry.cumulativeSales
                                  : null
                              }
                              name="Inicio Proyección (Febrero)"
                              stroke="#EF4444"
                              strokeDasharray="5 5"
                              dot={{ r: 6, fill: "#EF4444" }}
                            />

                            {/* Línea de stock */}
                            {calculateStockOutMonth && (
                              <Line
                                type="monotone"
                                dataKey={(entry: {
                                  month: number;
                                  monthName: string;
                                  cumulativeSales: any;
                                }) =>
                                  entry.monthName ===
                                  calculateStockOutMonth?.monthName
                                    ? entry.cumulativeSales
                                    : null
                                }
                                name="Agotamiento Stock"
                                stroke="#F59E0B"
                                strokeDasharray="5 5"
                                dot={{ r: 6, fill: "#F59E0B" }}
                              />
                            )}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </section>

                  {/* Tabla de proyección mejorada */}
                  <section className="bg-white rounded-lg shadow-md border-t-4 border-purple-500">
                    <div className="bg-purple-50 p-4 md:p-6 flex justify-between items-center flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-purple-500" />
                        <h2 className="text-lg font-semibold m-0">
                          Tabla de Proyección
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewMode("monthly")}
                          className={`px-3 py-1.5 rounded-md border border-gray-300 ${
                            viewMode === "monthly"
                              ? "bg-purple-500 text-white"
                              : "bg-white text-gray-700"
                          } text-sm cursor-pointer`}
                        >
                          Mensual
                        </button>
                        <button
                          onClick={() => setViewMode("annual")}
                          className={`px-3 py-1.5 rounded-md border border-gray-300 ${
                            viewMode === "annual"
                              ? "bg-purple-500 text-white"
                              : "bg-white text-gray-700"
                          } text-sm cursor-pointer`}
                        >
                          Anual
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-500 text-sm m-0 mb-4">
                        {viewMode === "monthly"
                          ? "Detalle mensual de ventas históricas y proyectadas"
                          : "Resumen anual de ventas históricas y proyectadas"}
                      </p>
                      <div className="overflow-x-auto">
                        {viewMode === "monthly" ? (
                          <>
                            {/* Tabla de condiciones iniciales (CI y K) */}
                            <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                              <h3 className="text-lg font-semibold mt-0 mb-3">
                                Condiciones Iniciales del Modelo
                              </h3>
                              <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-800 text-white">
                                  <tr>
                                    <th className="p-3 text-center font-bold border border-gray-700">
                                      Parámetro
                                    </th>
                                    <th className="p-3 text-center font-bold border border-gray-700">
                                      P = ventas totales
                                    </th>
                                    <th className="p-3 text-center font-bold border border-gray-700">
                                      t = Tiempo en meses
                                    </th>
                                    <th className="p-3 text-center font-bold border border-gray-700">
                                      Fecha
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="bg-blue-50">
                                    <td className="p-3 text-center font-bold border border-gray-300">
                                      Enero
                                    </td>
                                    <td className="p-3 text-center border border-gray-300">
                                      {selectedVariant?.salesData?.history[0]
                                        ?.sales || 0}{" "}
                                      Ventas totales
                                    </td>
                                    <td className="p-3 text-center border border-gray-300">
                                      0 meses
                                    </td>
                                    <td className="p-3 text-center font-medium border border-gray-300">
                                      31/01/2025
                                    </td>
                                  </tr>
                                  <tr className="bg-blue-50">
                                    <td className="p-3 text-center font-bold border border-gray-300">
                                      Febrero
                                    </td>
                                    <td className="p-3 text-center border border-gray-300">
                                      {selectedVariant?.salesData?.history[1]
                                        ?.sales || 0}{" "}
                                      Ventas totales
                                    </td>
                                    <td className="p-3 text-center border border-gray-300">
                                      1 mes
                                    </td>
                                    <td className="p-3 text-center font-medium border border-gray-300">
                                      28/02/2025
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="mt-3 text-center">
                                <p className="font-semibold m-0 mb-1">
                                  Ecuación de proyección: P = ce<sup>kt</sup>{" "}
                                  (modelo de crecimiento exponencial)
                                </p>
                                <p className="text-sm text-gray-500 m-0">
                                  Donde P = Ventas totales, c = ventas
                                  iniciales, t = tiempo, k = tasa de crecimiento
                                  (
                                  {(
                                    calculateGrowthRate(
                                      selectedVariant?.salesData?.history || []
                                    ) * 100
                                  ).toFixed(1)}
                                  % mensual)
                                </p>
                              </div>
                            </div>

                            {/* Tabla de proyección mensual */}
                            <table className="w-full border-collapse">
                              <thead className="bg-slate-100">
                                <tr>
                                  <th className="p-3 text-left font-semibold border-b border-gray-200">
                                    Mes
                                  </th>
                                  <th className="p-3 text-left font-semibold border-b border-gray-200">
                                    Ventas Proyectadas
                                  </th>
                                  <th className="p-3 text-left font-semibold border-b border-gray-200">
                                    Crecimiento
                                  </th>
                                  <th className="p-3 text-left font-semibold border-b border-gray-200">
                                    Ventas totales
                                  </th>
                                  <th className="p-3 text-left font-semibold border-b border-gray-200">
                                    Stock Restante
                                  </th>
                                  <th className="p-3 text-left font-semibold border-b border-gray-200">
                                    Estado
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {salesProjectionData.map((month, index) => {
                                  const isHistorical = month.isHistorical;
                                  const prevMonth =
                                    index > 0
                                      ? salesProjectionData[index - 1].sales
                                      : null;
                                  const growthRate = prevMonth
                                    ? ((month.sales - prevMonth) / prevMonth) *
                                      100
                                    : null;
                                  const cumulativeSales = month.cumulativeSales;
                                  const salesFromMarch =
                                    month.month >= 2
                                      ? salesProjectionData
                                          .filter(
                                            (m) =>
                                              m.month >= 2 &&
                                              m.month <= month.month
                                          )
                                          .reduce((sum, m) => sum + m.sales, 0)
                                      : 0;
                                  const remainingStock = Math.max(
                                    0,
                                    selectedVariant.stock - salesFromMarch
                                  );
                                  const isStockOut =
                                    remainingStock === 0 && cumulativeSales > 0;

                                  return (
                                    <tr
                                      key={month.month}
                                      className={`${
                                        isStockOut
                                          ? "bg-amber-50"
                                          : isHistorical
                                          ? "bg-blue-50/30"
                                          : "bg-purple-50/30"
                                      }`}
                                    >
                                      <td className="p-3 border-b border-gray-200 font-medium">
                                        {month.monthName}{" "}
                                        {new Date().getFullYear()}
                                      </td>
                                      <td className="p-3 border-b border-gray-200 font-bold">
                                        {month.sales} unidades
                                        {!isHistorical && (
                                          <span className="ml-2 text-xs text-purple-500 font-normal">
                                            (Proyección)
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-3 border-b border-gray-200">
                                        {renderGrowthIndicator(growthRate)}
                                      </td>
                                      <td className="p-3 border-b border-gray-200 font-bold">
                                        {month.cumulativeSales} unidades
                                      </td>
                                      <td className="p-3 border-b border-gray-200">
                                        {month.month >= 2 ? (
                                          <span
                                            className={`inline-block px-2 py-0.5 rounded-full text-sm ${
                                              remainingStock < 5
                                                ? "bg-red-100 text-red-700 border border-red-200"
                                                : remainingStock < 10
                                                ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                                                : "bg-gray-100 text-gray-700 border border-gray-200"
                                            }`}
                                          >
                                            {remainingStock} unidades
                                          </span>
                                        ) : (
                                          <span className="text-gray-400">
                                            -
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-3 border-b border-gray-200">
                                        {isStockOut ? (
                                          <span className="inline-block px-2 py-0.5 rounded-full text-sm bg-amber-100 text-amber-800 border border-amber-200">
                                            Agotamiento
                                          </span>
                                        ) : isHistorical ? (
                                          <span className="inline-block px-2 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                                            Histórico
                                          </span>
                                        ) : (
                                          <span className="inline-block px-2 py-0.5 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200">
                                            Proyección
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <table className="w-full border-collapse">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="p-3 text-left font-semibold border-b border-gray-200">
                                  Año
                                </th>
                                <th className="p-3 text-left font-semibold border-b border-gray-200">
                                  Ventas Totales
                                </th>
                                <th className="p-3 text-left font-semibold border-b border-gray-200">
                                  Tipo
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {annualProjectionData.map((yearData) => (
                                <tr
                                  key={yearData.year}
                                  className={`${
                                    yearData.isHistorical
                                      ? "bg-blue-50/30"
                                      : "bg-purple-50/30"
                                  }`}
                                >
                                  <td className="p-3 text-left font-medium border-b border-gray-200">
                                    {yearData.year}
                                  </td>
                                  <td className="p-3 text-left font-bold border-b border-gray-200">
                                    {yearData.sales} unidades
                                    {!yearData.isHistorical && (
                                      <span className="ml-2 text-xs text-purple-500 font-normal">
                                        (Incluye proyección)
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-left border-b border-gray-200">
                                    {yearData.isHistorical ? (
                                      <span className="inline-block px-2 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                                        Datos Históricos
                                      </span>
                                    ) : (
                                      <span className="inline-block px-2 py-0.5 rounded-full text-sm bg-purple-100 text-purple-800 border border-purple-200">
                                        Proyección
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 md:p-6 rounded-b-lg text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          Proyecciones basadas en datos históricos de Enero y
                          Febrero 2024
                        </span>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <section className="bg-white rounded-lg shadow-md">
                  <div className="p-12 flex flex-col items-center justify-center">
                    <TrendingUp size={64} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      Selecciona una Variante
                    </h3>
                    <p className="text-gray-500 text-center max-w-md mb-6">
                      Para ver la proyección de ventas, primero selecciona una
                      variante específica desde la pestaña de Variantes o desde
                      el Resumen.
                    </p>
                    <button
                      onClick={() => setActiveTab("variants")}
                      className="px-4 py-2 rounded-md bg-blue-500 text-white border-none cursor-pointer text-base"
                    >
                      Ir a Variantes
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <RefreshCw size={48} className="text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-medium">Cargando datos...</h3>
          </div>
        </div>
      )}

      {!isLoading && !selectedProduct && (
        <section className="bg-white rounded-lg shadow-md">
          <div className="p-12 flex flex-col items-center justify-center">
            <Search size={64} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Selecciona un Producto</h3>
            <p className="text-gray-500 text-center max-w-md">
              Para comenzar el análisis, selecciona un producto del menú
              desplegable.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
