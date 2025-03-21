"use client";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

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
  // Datos simulados de ventas
  salesData?: {
    lastWeek: number;
    lastMonth: number;
    total: number;
    history: { week: number; sales: number }[];
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

// Modificar la función generateSalesData para reducir a solo 2 semanas de historial
const generateSalesData = (variant: ProductVariant) => {
  // Verificar que la variante tenga los datos necesarios
  if (!variant || !variant.size || !variant.color) {
    console.warn("Variante con datos incompletos:", variant);
    // Retornar datos predeterminados para evitar errores
    return {
      lastWeek: 5,
      lastMonth: 20,
      total: 50,
      history: [
        { week: 1, sales: 40 }, // CI - Primera semana (penúltima)
        { week: 2, sales: 100 }, // K - Segunda semana (última)
      ],
    };
  }

  // Factores que influyen en la popularidad
  const popularSizes = ["MED", "G"]; // Tallas más populares
  const popularColors = ["Negro", "Azul marino", "Blanco"]; // Colores más populares

  // Base de ventas semanales (entre 5 y 15) - Reducida para mejor visualización
  let baseSales = Math.floor(Math.random() * 5) + 5;

  // Ajustar por popularidad de talla (hasta +5 ventas)
  if (variant.size.name && popularSizes.includes(variant.size.name)) {
    baseSales += Math.floor(Math.random() * 3) + 1;
  }

  // Ajustar por popularidad de color (hasta +5 ventas)
  if (variant.color.name && popularColors.includes(variant.color.name)) {
    baseSales += Math.floor(Math.random() * 3) + 1;
  }

  // Generar solo 2 semanas de historial
  const history = [
    { week: 1, sales: Math.max(1, Math.round(baseSales * 0.8)) }, // CI - Primera semana (penúltima)
    { week: 2, sales: Math.max(1, Math.round(baseSales * 1.2)) }, // K - Segunda semana (última)
  ];

  // Calcular totales
  const lastWeek = history[history.length - 1].sales;
  const lastMonth = history.reduce((sum, week) => sum + week.sales, 0);
  const total = lastMonth;

  return {
    lastWeek,
    lastMonth,
    total,
    history,
  };
};

// Modificar la función enrichProductsWithSalesData para aumentar aún más el stock
const enrichProductsWithSalesData = (products: Product[]): Product[] => {
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      // Aumentar el stock significativamente para ver el agotamiento en más semanas
      stock: variant.stock * 50, // Multiplicamos el stock por 50 para ver proyección a más largo plazo
      salesData: generateSalesData(variant),
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
  const [viewMode, setViewMode] = useState<"weekly" | "monthly" | "annual">(
    "weekly"
  );

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

  // Calcular tasa de crecimiento basada en el historial
  const calculateGrowthRate = (history: { week: number; sales: number }[]) => {
    if (history.length < 2) return 0.05; // Tasa predeterminada

    // Con solo 2 semanas, calculamos directamente la tasa de crecimiento
    const firstWeekSales = history[0].sales;
    const secondWeekSales = history[1].sales;

    if (firstWeekSales <= 0) return 0.05; // Evitar división por cero

    // Calcular tasa de crecimiento semanal
    const weeklyRate = (secondWeekSales - firstWeekSales) / firstWeekSales;

    // Limitar la tasa entre -0.1 y 0.2
    return Math.max(-0.1, Math.min(0.2, weeklyRate));
  };

  // Obtener fecha para una semana específica
  const getDateForWeek = (week: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (week - 1) * 7);
    return targetDate.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Datos para el gráfico de proyección de ventas
  const salesProjectionData = useMemo(() => {
    if (!selectedVariant || !selectedVariant.salesData) return [];

    const history = selectedVariant.salesData.history;
    const initialSales = history[history.length - 1].sales; // P₀ (ventas iniciales)
    const growthRate = calculateGrowthRate(history); // k (constante de proporcionalidad)

    // Proyectar 24 semanas más usando el modelo exponencial P(t) = P₀e^(kt)
    const projection = Array.from({ length: 24 }, (_, i) => {
      const week = history.length + i + 1;
      const timeElapsed = i + 1; // t (tiempo transcurrido en semanas)
      const projectedSales = Math.round(
        initialSales * Math.exp(growthRate * timeElapsed)
      );
      return { week, sales: projectedSales };
    });

    return [...history, ...projection];
  }, [selectedVariant]);

  // Calcular semana de agotamiento
  const calculateStockOutWeek = useMemo(() => {
    if (!selectedVariant || !selectedVariant.salesData) return null;

    const projectionData = salesProjectionData;
    const remainingStock = selectedVariant.stock;
    let cumulativeSales = 0;

    for (let i = 0; i < projectionData.length; i++) {
      const weeklySales = projectionData[i].sales;
      cumulativeSales += weeklySales;

      if (cumulativeSales >= remainingStock) {
        return {
          week: projectionData[i].week,
          date: getDateForWeek(projectionData[i].week),
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
        .filter((w) => w.week <= 12)
        .reduce((sum, w) => sum + w.sales, 0),
      isHistorical: true,
    };

   

    // Calcular datos para el año siguiente (proyección)
    const nextYearTotal = {
      year: currentYear + 1,
      sales: weeklyData
        .filter((w) => {
          const date = new Date();
          date.setDate(date.getDate() + (w.week - 1) * 7);
          return date.getFullYear() === currentYear + 1;
        })
        .reduce((sum, w) => sum + w.sales, 0),
      isHistorical: false,
    };

    annualData.push(currentYearHistorical, nextYearTotal);

    return annualData;
  }, [selectedVariant, salesProjectionData]);

  // Modificar la función para calcular proyecciones mensuales
  const calculateMonthlyProjections = (weeklyData: any[]) => {
    if (!weeklyData || weeklyData.length === 0) return [];

    // Agrupar datos semanales en meses (4 semanas por mes)
    const monthlyData: { month: number; sales: number; isHistorical: boolean }[] = [];
    let currentMonth = 1;
    let monthSales = 0;
    let weeksInMonth = 0;

    weeklyData.forEach((week, index) => {
      monthSales += week.sales;
      weeksInMonth++;

      // Cada 4 semanas, crear un nuevo mes
      if (weeksInMonth === 4 || index === weeklyData.length - 1) {
        monthlyData.push({
          month: currentMonth,
          sales: monthSales,
          isHistorical: currentMonth === 1 && index < 2, // Solo el primer mes (parcial) es histórico
        });

        currentMonth++;
        monthSales = 0;
        weeksInMonth = 0;
      }
    });

    return monthlyData;
  };

  // Calcular proyecciones mensuales
  const monthlyProjectionData = useMemo(() => {
    return calculateMonthlyProjections(salesProjectionData);
  }, [salesProjectionData]);

  // Manejar cambio de producto
  const handleProductChange = (productId: string) => {
    setSelectedProductId(Number(productId));
    setSelectedColorId(null);
    setSelectedSizeId(null);
    setSelectedVariantId(null);
  };

  // Manejar cambio de color
  const handleColorChange = (colorId: string) => {
    setSelectedColorId(Number(colorId));
    setSelectedVariantId(null);
  };

  // Manejar cambio de talla
  const handleSizeChange = (sizeId: string) => {
    setSelectedSizeId(Number(sizeId));
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="bg-white/20 p-4 rounded-lg">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">
              Análisis de Ventas por Talla y Color
            </h1>
            <p className="text-gray-100 mt-1">
              Analiza qué tallas y colores se venden más y realiza proyecciones
              de inventario
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                Modelo Exponencial dP/dt=kP
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                Proyección a 12 Semanas
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                Análisis de Agotamiento
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de producto */}
      <Card>
        <CardHeader className="bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <CardTitle>Seleccionar Producto</CardTitle>
          </div>
          <CardDescription>
            Elige un producto para analizar sus ventas por talla y color
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Select
            value={selectedProductId?.toString() || ""}
            onValueChange={handleProductChange}
          >
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Selecciona un producto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProduct && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="variants" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Variantes</span>
            </TabsTrigger>
            <TabsTrigger value="projection" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Proyección</span>
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Resumen */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gráfico de ventas por color */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-600" />
                    <CardTitle>Ventas por Color</CardTitle>
                  </div>
                  <CardDescription>
                    Distribución de ventas según el color del producto
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                          formatter={(value: any) => [`${value} unidades`, "Ventas"]}
                          labelFormatter={(label: any) => `Color: ${label}`}
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
                </CardContent>
              </Card>

              {/* Gráfico de ventas por talla */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-blue-600" />
                    <CardTitle>Ventas por Talla</CardTitle>
                  </div>
                  <CardDescription>
                    Distribución de ventas según la talla del producto
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                          formatter={(value: any) => [`${value} unidades`, "Ventas"]}
                          labelFormatter={(label: any) => `Talla: ${label}`}
                        />
                        <Bar dataKey="sales" name="Ventas" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de distribución combinada */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-blue-600" />
                  <CardTitle>Distribución de Ventas</CardTitle>
                </div>
                <CardDescription>
                  Visualización de las combinaciones más vendidas de talla y
                  color
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
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
                        label={({ name, percent }: { name: string; percent: number }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {selectedProduct.variants.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.color.hexValue ||
                              CHART_COLORS[index % CHART_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value} unidades`, "Ventas"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de mejores combinaciones */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <CardTitle>Top Combinaciones</CardTitle>
                </div>
                <CardDescription>
                  Las combinaciones de talla y color más vendidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Modificar la tabla de mejores combinaciones para mostrar imágenes */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Posición</TableHead>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Talla</TableHead>
                      <TableHead>Ventas Totales</TableHead>
                      <TableHead>Stock Actual</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedProduct.variants
                      .sort(
                        (a, b) =>
                          (b.salesData?.total || 0) - (a.salesData?.total || 0)
                      )
                      .slice(0, 10)
                      .map((variant, index) => (
                        <TableRow
                          key={variant.id}
                          className={
                            selectedVariantId === variant.id ? "bg-blue-50" : ""
                          }
                        >
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <img
                              src={variant.imageUrl || "/placeholder.svg"}
                              alt={`${selectedProduct.name} - ${variant.color.name}`}
                              className="w-12 h-12 object-contain border rounded-md"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: variant.color.hexValue,
                                }}
                              />
                              {variant.color.name}
                            </div>
                          </TableCell>
                          <TableCell>{variant.size.name}</TableCell>
                          <TableCell>
                            {variant.salesData?.total || 0} unidades
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                variant.stock < 5 ? "destructive" : "outline"
                              }
                            >
                              {variant.stock} unidades
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVariantSelect(variant.id)}
                            >
                              Seleccionar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Variantes */}
          <TabsContent value="variants" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <CardTitle>Filtrar Variantes</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </div>
                <CardDescription>
                  Filtra las variantes por color y talla
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <Select
                      value={selectedColorId?.toString() || ""}
                      onValueChange={handleColorChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los colores" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los colores</SelectItem>
                        {availableColors.map((color) => (
                          <SelectItem
                            key={color.id}
                            value={color.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color.hexValue }}
                              />
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Talla</label>
                    <Select
                      value={selectedSizeId?.toString() || ""}
                      onValueChange={handleSizeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las tallas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las tallas</SelectItem>
                        {availableSizes.map((size) => (
                          <SelectItem key={size.id} value={size.id.toString()}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <CardTitle>Variantes del Producto</CardTitle>
                </div>
                <CardDescription>
                  {filteredVariants.length} variantes encontradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Modificar la tabla de variantes para mostrar imágenes de productos */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Talla</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Ventas</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVariants.map((variant) => (
                      <TableRow
                        key={variant.id}
                        className={
                          selectedVariantId === variant.id ? "bg-blue-50" : ""
                        }
                      >
                        <TableCell>
                          <img
                            src={variant.imageUrl || "/placeholder.svg"}
                            alt={`${selectedProduct.name} - ${variant.color.name}`}
                            className="w-12 h-12 object-contain border rounded-md"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {variant.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: variant.color.hexValue,
                              }}
                            />
                            {variant.color.name}
                          </div>
                        </TableCell>
                        <TableCell>{variant.size.name}</TableCell>
                        <TableCell>${variant.price}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              variant.stock < 5 ? "destructive" : "outline"
                            }
                          >
                            {variant.stock} unidades
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {variant.salesData?.total || 0} unidades
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Último mes: {variant.salesData?.lastMonth || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={
                              selectedVariantId === variant.id
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleVariantSelect(variant.id)}
                          >
                            {selectedVariantId === variant.id
                              ? "Seleccionado"
                              : "Seleccionar"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña de Proyección */}
          <TabsContent value="projection" className="space-y-4">
            {selectedVariant ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Modificar la sección de la tarjeta de variante seleccionada para incluir la imagen del producto */}
                  <Card>
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-700">
                        Variante Seleccionada
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                          <img
                            src={selectedVariant.imageUrl || "/placeholder.svg"}
                            alt={`${selectedProduct.name} - ${selectedVariant.color.name}`}
                            className="w-32 h-32 object-contain border rounded-md shadow-sm"
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{
                                backgroundColor: selectedVariant.color.hexValue,
                              }}
                            />
                            <span className="font-medium">
                              {selectedProduct.name}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Color
                            </div>
                            <div className="font-medium">
                              {selectedVariant.color.name}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Talla
                            </div>
                            <div className="font-medium">
                              {selectedVariant.size.name}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Precio
                            </div>
                            <div className="font-medium">
                              ${selectedVariant.price}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Stock
                            </div>
                            <div className="font-medium">
                              {selectedVariant.stock} unidades
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-700">
                        Ventas Actuales
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Última Semana
                          </div>
                          <div className="text-2xl font-bold">
                            {selectedVariant.salesData?.lastWeek || 0}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Último Mes
                          </div>
                          <div className="text-2xl font-bold">
                            {selectedVariant.salesData?.lastMonth || 0}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm text-muted-foreground">
                            Total Vendido
                          </div>
                          <div className="text-2xl font-bold">
                            {selectedVariant.salesData?.total || 0} unidades
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-amber-50">
                      <CardTitle className="text-amber-700">
                        Modelo de Proyección
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Modelo Matemático
                          </div>
                          <div className="text-lg font-medium">dP/dt = kP</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Donde P = cantidad de ventas, k = constante de
                            proporcionalidad
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground">
                            Condición Inicial (P₀)
                          </div>
                          <div className="text-xl font-bold">
                            {
                              selectedVariant.salesData?.history[
                                selectedVariant.salesData.history.length - 1
                              ].sales
                            }{" "}
                            unidades
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Ventas en la última semana registrada
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground">
                            Constante de Proporcionalidad (k)
                          </div>
                          <div className="text-xl font-bold">
                            {(
                              calculateGrowthRate(
                                selectedVariant.salesData?.history || []
                              ) * 100
                            ).toFixed(1)}
                            % semanal
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tasa de crecimiento exponencial
                          </div>
                        </div>

                        {calculateStockOutWeek ? (
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Agotamiento Estimado
                            </div>
                            <div className="text-xl font-bold">
                              Semana {calculateStockOutWeek.week}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {calculateStockOutWeek.date}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Agotamiento Estimado
                            </div>
                            <div className="text-xl font-bold text-green-600">
                              No se agotará en 24 semanas
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Añadir una nueva tarjeta que muestre claramente los datos históricos de ventas */}

                {/* Modificar la tarjeta de historial de ventas para mostrar solo 2 semanas */}
                <Card className="shadow-lg border-t-4 border-t-green-600">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                      <CardTitle>Historial de Ventas</CardTitle>
                    </div>
                    <CardDescription>
                      Datos históricos de ventas semanales (CI y K)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parámetro</TableHead>
                            <TableHead>Semana</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Ventas</TableHead>
                            <TableHead>Crecimiento</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedVariant.salesData?.history.map(
                            (week, index) => {
                              const prevWeek =
                                index > 0
                                  ? selectedVariant.salesData?.history[
                                      index - 1
                                    ].sales
                                  : null;
                              const growthRate = prevWeek
                                ? ((week.sales - prevWeek) / prevWeek) * 100
                                : null;

                              return (
                                <TableRow key={week.week}>
                                  <TableCell className="font-medium">
                                    {index === 0 ? "CI" : "K"}
                                  </TableCell>
                                  <TableCell>Semana {week.week}</TableCell>
                                  <TableCell>
                                    {getDateForWeek(week.week)}
                                  </TableCell>
                                  <TableCell className="font-bold">
                                    {week.sales} unidades
                                  </TableCell>
                                  <TableCell>
                                    {growthRate !== null ? (
                                      <div className="flex items-center gap-1">
                                        {growthRate > 0 ? (
                                          <span className="text-green-600 flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            +{growthRate.toFixed(1)}%
                                          </span>
                                        ) : growthRate < 0 ? (
                                          <span className="text-red-600 flex items-center">
                                            <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                                            {growthRate.toFixed(1)}%
                                          </span>
                                        ) : (
                                          <span className="text-gray-500">
                                            0%
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-gray-500">-</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Mejorar la visualización de datos históricos vs proyectados en el gráfico */}

                {/* Modificar la visualización del gráfico de proyección */}
                <Card className="shadow-lg border-t-4 border-t-blue-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LineChartIcon className="w-5 h-5 text-blue-600" />
                        <CardTitle>Proyección de Ventas</CardTitle>
                      </div>
                      <div>
                        <Badge className="bg-blue-100 text-blue-800 mr-2">
                          Histórico (CI y K)
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          Proyección
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      Historial y proyección de ventas para las próximas 24
                      semanas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={salesProjectionData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="week"
                            label={{
                              value: "Semana",
                              position: "insideBottomRight",
                              offset: -10,
                            }}
                          />
                          <YAxis
                            label={{
                              value: "Unidades",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value: any) => [
                              `${value} unidades`,
                              "Ventas",
                            ]}
                            labelFormatter={(label: any) => `Semana ${label}`}
                            contentStyle={{
                              backgroundColor: "#f8fafc",
                              borderRadius: "8px",
                              border: "1px solid #e2e8f0",
                            }}
                          />
                          <Legend verticalAlign="top" height={36} />

                          {/* Área para datos históricos */}
                          <defs>
                            <linearGradient
                              id="colorHistorical"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#3B82F6"
                                stopOpacity={0.1}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3B82F6"
                                stopOpacity={0.0}
                              />
                            </linearGradient>
                          </defs>

                          {/* Área para datos proyectados */}
                          <defs>
                            <linearGradient
                              id="colorProjection"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8B5CF6"
                                stopOpacity={0.1}
                              />
                              <stop
                                offset="95%"
                                stopColor="#8B5CF6"
                                stopOpacity={0.0}
                              />
                            </linearGradient>
                          </defs>

                          {/* Datos históricos con área */}
                          <Line
                            type="monotone"
                            dataKey={(entry: { week: number; sales: any; }) =>
                              entry.week <= 2 ? entry.sales : null
                            }
                            name="Ventas Históricas (CI y K)"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#3B82F6" }}
                            activeDot={{ r: 8 }}
                            fill="url(#colorHistorical)"
                          />

                          {/* Datos proyectados con área */}
                          <Line
                            type="monotone"
                            dataKey={(entry: { week: number; sales: any; }) =>
                              entry.week > 2 ? entry.sales : null
                            }
                            name="Ventas Proyectadas"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4, fill: "#8B5CF6" }}
                            fill="url(#colorProjection)"
                          />

                          {/* Línea que divide historial de proyección */}
                          <Line
                            type="monotone"
                            dataKey={(entry: { week: number; sales: any; }) =>
                              entry.week === 2 ? entry.sales : null
                            }
                            name="Inicio Proyección"
                            stroke="#EF4444"
                            strokeDasharray="5 5"
                            dot={{ r: 6, fill: "#EF4444" }}
                          />

                          {/* Línea de stock */}
                          {calculateStockOutWeek && (
                            <Line
                              type="monotone"
                              dataKey={(entry: { week: number; sales: any; }) =>
                                entry.week === calculateStockOutWeek?.week
                                  ? entry.sales
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
                  </CardContent>
                </Card>

                {/* Reemplazar la tabla de proyección con una versión mejorada que muestre claramente datos reales y proyectados */}
                {/* Buscar la sección de la Card con la tabla de proyección y reemplazarla con: */}

                <Card className="shadow-lg border-t-4 border-t-purple-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <CardTitle>Tabla de Proyección</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={
                            viewMode === "weekly" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setViewMode("weekly")}
                        >
                          Semanal
                        </Button>
                        <Button
                          variant={
                            viewMode === "monthly" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setViewMode("monthly")}
                        >
                          Mensual
                        </Button>
                        <Button
                          variant={
                            viewMode === "annual" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setViewMode("annual")}
                        >
                          Anual
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      {viewMode === "weekly"
                        ? "Detalle semanal de ventas históricas y proyectadas"
                        : viewMode === "monthly"
                        ? "Detalle mensual de ventas históricas y proyectadas"
                        : "Resumen anual de ventas históricas y proyectadas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      {viewMode === "weekly" ? (
                        <>
                          {/* Tabla de condiciones iniciales (CI y K) */}
                          <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">
                              Condiciones Iniciales del Modelo
                            </h3>
                            <Table className="border">
                              <TableHeader className="bg-gray-800 text-white">
                                <TableRow>
                                  <TableHead className="text-center font-bold">
                                    Parámetro
                                  </TableHead>
                                  <TableHead className="text-center font-bold">
                                    P = ventas
                                  </TableHead>
                                  <TableHead className="text-center font-bold">
                                    t = Tiempo en semanas
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="bg-blue-50">
                                  <TableCell className="text-center font-bold">
                                    CI
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {selectedVariant?.salesData?.history[0]
                                      ?.sales || 0}{" "}
                                    ventas
                                  </TableCell>
                                  <TableCell className="text-center">
                                    1 semana
                                  </TableCell>
                                </TableRow>
                                <TableRow className="bg-blue-50">
                                  <TableCell className="text-center font-bold">
                                    K
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {selectedVariant?.salesData?.history[1]
                                      ?.sales || 0}{" "}
                                    ventas
                                  </TableCell>
                                  <TableCell className="text-center">
                                    2 semanas
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            <div className="mt-3 text-center">
                              <p className="font-semibold">
                                Ecuación diferencial: dP/dt = kP
                              </p>
                              <p className="text-sm text-gray-600">
                                Donde k ={" "}
                                {(
                                  calculateGrowthRate(
                                    selectedVariant?.salesData?.history || []
                                  ) * 100
                                ).toFixed(1)}
                                % semanal
                              </p>
                            </div>
                          </div>

                          {/* Tabla de proyección semanal */}
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Semana</TableHead>
                                <TableHead>Fecha Estimada</TableHead>
                                <TableHead>Ventas Proyectadas</TableHead>
                                <TableHead>Crecimiento</TableHead>
                                <TableHead>Ventas Acumuladas</TableHead>
                                <TableHead>Stock Restante</TableHead>
                                <TableHead>Estado</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {salesProjectionData.map((week, index) => {
                                const isHistorical = index < 2; // Solo las primeras 2 semanas son históricas
                                const prevWeek =
                                  index > 0
                                    ? salesProjectionData[index - 1].sales
                                    : null;
                                const growthRate = prevWeek
                                  ? ((week.sales - prevWeek) / prevWeek) * 100
                                  : null;
                                const cumulativeSales = salesProjectionData
                                  .slice(0, index + 1)
                                  .reduce((sum, w) => sum + w.sales, 0);
                                const remainingStock = Math.max(
                                  0,
                                  selectedVariant.stock - cumulativeSales
                                );
                                const isStockOut =
                                  remainingStock === 0 && cumulativeSales > 0;

                                return (
                                  <TableRow
                                    key={week.week}
                                    className={
                                      isStockOut
                                        ? "bg-amber-50"
                                        : isHistorical
                                        ? "bg-blue-50/30"
                                        : "bg-purple-50/30"
                                    }
                                  >
                                    <TableCell className="font-medium">
                                      {index === 0
                                        ? "CI"
                                        : index === 1
                                        ? "K"
                                        : `P${index - 1}`}
                                    </TableCell>
                                    <TableCell>
                                      {getDateForWeek(week.week)}
                                    </TableCell>
                                    <TableCell className="font-bold">
                                      {week.sales} unidades
                                      {!isHistorical && (
                                        <span className="ml-2 text-xs text-purple-600 font-normal">
                                          (Proyección)
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {growthRate !== null ? (
                                        <div className="flex items-center gap-1">
                                          {growthRate > 0 ? (
                                            <span className="text-green-600 flex items-center">
                                              <TrendingUp className="w-4 h-4 mr-1" />
                                              +{growthRate.toFixed(1)}%
                                            </span>
                                          ) : growthRate < 0 ? (
                                            <span className="text-red-600 flex items-center">
                                              <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                                              {growthRate.toFixed(1)}%
                                            </span>
                                          ) : (
                                            <span className="text-gray-500">
                                              0%
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-gray-500">-</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {cumulativeSales} unidades
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          remainingStock < 5
                                            ? "destructive"
                                            : remainingStock < 10
                                            ? "secondary"
                                            : "outline"
                                        }
                                      >
                                        {remainingStock} unidades
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {isStockOut ? (
                                        <Badge
                                          variant="destructive"
                                          className="bg-amber-500"
                                        >
                                          Agotamiento
                                        </Badge>
                                      ) : isHistorical ? (
                                        <Badge
                                          variant="secondary"
                                          className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                                        >
                                          Histórico
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                                        >
                                          Proyección
                                        </Badge>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </>
                      ) : viewMode === "monthly" ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Mes</TableHead>
                              <TableHead>Ventas Proyectadas</TableHead>
                              <TableHead>Ventas Acumuladas</TableHead>
                              <TableHead>Stock Restante</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {monthlyProjectionData.map((month, index) => {
                              const cumulativeSales = monthlyProjectionData
                                .slice(0, index + 1)
                                .reduce((sum, m) => sum + m.sales, 0);
                              const remainingStock = Math.max(
                                0,
                                selectedVariant.stock - cumulativeSales
                              );
                              const isStockOut =
                                remainingStock === 0 && cumulativeSales > 0;

                              return (
                                <TableRow
                                  key={month.month}
                                  className={
                                    isStockOut
                                      ? "bg-amber-50"
                                      : month.isHistorical
                                      ? "bg-blue-50/30"
                                      : "bg-purple-50/30"
                                  }
                                >
                                  <TableCell className="font-medium">
                                    Mes {month.month}
                                  </TableCell>
                                  <TableCell className="font-bold">
                                    {month.sales} unidades
                                    {!month.isHistorical && (
                                      <span className="ml-2 text-xs text-purple-600 font-normal">
                                        (Proyección)
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {cumulativeSales} unidades
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        remainingStock < 5
                                          ? "destructive"
                                          : remainingStock < 10
                                          ? "secondary"
                                          : "outline"
                                      }
                                    >
                                      {remainingStock} unidades
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {isStockOut ? (
                                      <Badge
                                        variant="destructive"
                                        className="bg-amber-500"
                                      >
                                        Agotamiento
                                      </Badge>
                                    ) : month.isHistorical ? (
                                      <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                                      >
                                        Histórico
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                                      >
                                        Proyección
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Año</TableHead>
                              <TableHead>Ventas Totales</TableHead>
                              <TableHead>Tipo</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {annualProjectionData.map((yearData) => (
                              <TableRow
                                key={yearData.year}
                                className={
                                  yearData.isHistorical
                                    ? "bg-blue-50/30"
                                    : "bg-purple-50/30"
                                }
                              >
                                <TableCell className="font-medium">
                                  {yearData.year}
                                </TableCell>
                                <TableCell className="font-bold">
                                  {yearData.sales} unidades
                                  {!yearData.isHistorical && (
                                    <span className="ml-2 text-xs text-purple-600 font-normal">
                                      (Incluye proyección)
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {yearData.isHistorical ? (
                                    <Badge
                                      variant="secondary"
                                      className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    >
                                      Datos Históricos
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-purple-100 text-purple-800 hover:bg-purple-100"
                                    >
                                      Proyección
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <TrendingUp className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Selecciona una Variante
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Para ver la proyección de ventas, primero selecciona una
                    variante específica desde la pestaña de Variantes o desde el
                    Resumen.
                  </p>
                  <Button onClick={() => setActiveTab("variants")}>
                    Ir a Variantes
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-medium">Cargando datos...</h3>
          </div>
        </div>
      )}

      {!isLoading && !selectedProduct && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Search className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Selecciona un Producto</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Para comenzar el análisis, selecciona un producto del menú
              desplegable.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
