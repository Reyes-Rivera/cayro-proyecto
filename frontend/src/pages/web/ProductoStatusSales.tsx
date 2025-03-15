"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  XCircle,
  AlertCircle,
  ShoppingCart,
  TrendingUp,
  Check,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Types
interface Product {
  id: number;
  name: string;
}

interface ProductVariant {
  id: number;
  productId: number;
  size: string;
  color: string;
  stock: number;
  salesWeek1: number; // Total sales at end of week 1
  salesWeek2: number; // Total sales at end of week 2
}

// Sample data
const products: Product[] = [
  {
    id: 1,
    name: "Polo Escolar",
  },
  {
    id: 2,
    name: "Pantalón Uniforme",
  },
  {
    id: 3,
    name: "Playera Deportiva",
  },
];

const productVariants: ProductVariant[] = [
  {
    id: 1,
    productId: 1,
    size: "M",
    color: "Blanco",
    stock: 1000,
    salesWeek1: 40,
    salesWeek2: 100,
  },
  {
    id: 2,
    productId: 1,
    size: "L",
    color: "Azul",
    stock: 800,
    salesWeek1: 35,
    salesWeek2: 85,
  },
  {
    id: 3,
    productId: 1,
    size: "S",
    color: "Rojo",
    stock: 750,
    salesWeek1: 50,
    salesWeek2: 130,
  },
  {
    id: 4,
    productId: 2,
    size: "32",
    color: "Negro",
    stock: 600,
    salesWeek1: 25,
    salesWeek2: 60,
  },
  {
    id: 5,
    productId: 2,
    size: "30",
    color: "Gris",
    stock: 550,
    salesWeek1: 30,
    salesWeek2: 70,
  },
  {
    id: 6,
    productId: 3,
    size: "M",
    color: "Verde",
    stock: 450,
    salesWeek1: 20,
    salesWeek2: 45,
  },
  {
    id: 7,
    productId: 3,
    size: "L",
    color: "Azul",
    stock: 500,
    salesWeek1: 15,
    salesWeek2: 40,
  },
];

interface SalesProjection {
  week: number;
  date: string;
  weeklySales: number; // Sales during this week
  totalSales: number; // Cumulative sales up to this week
  remainingStock: number;
}

// Opciones de ordenación
type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Semana (Ascendente)", value: "week", direction: "asc" },
  { label: "Semana (Descendente)", value: "week", direction: "desc" },
  { label: "Ventas (Mayor a menor)", value: "totalSales", direction: "desc" },
  { label: "Ventas (Menor a mayor)", value: "totalSales", direction: "asc" },
];

const ProductoStatusSales: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [filteredVariants, setFilteredVariants] = useState<ProductVariant[]>(
    []
  );
  const [projections, setProjections] = useState<SalesProjection[]>([]);
  const [stockOutWeek, setStockOutWeek] = useState<number | null>(null);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para ordenación
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Actualizar variantes filtradas cuando cambia el producto seleccionado
  useEffect(() => {
    if (selectedProductId) {
      const variants = productVariants.filter(
        (v) => v.productId === selectedProductId
      );
      // Ordenar por ventas (de mayor a menor)
      variants.sort((a, b) => b.salesWeek2 - a.salesWeek2);
      setFilteredVariants(variants);
      setSelectedVariant(null);
      setHasCalculated(false);
    } else {
      setFilteredVariants([]);
    }
  }, [selectedProductId]);

  // Handle product selection
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = Number.parseInt(e.target.value);
    setSelectedProductId(productId);
    setHasCalculated(false);
  };

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setHasCalculated(false);
  };

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate sales projections
  const calculateProjections = () => {
    setIsRefreshing(true);

    if (!selectedVariant) {
      setIsRefreshing(false);
      return;
    }

    // Calculate weekly sales for week 1 and 2
    const week1Sales = selectedVariant.salesWeek1;
    const week2Sales = selectedVariant.salesWeek2 - selectedVariant.salesWeek1; // Sales during week 2

    // Calculate growth rate based on first two weeks
    // Using the differential equation model: dp/dt = kp
    // If p1 is sales in week 1 and p2 is sales in week 2
    // Then p2 = p1 * e^k, so k = ln(p2/p1)
    const growthRate = Math.log(week2Sales / week1Sales);

    const projectionData: SalesProjection[] = [];
    let totalSales = 0;
    let stockOutWeekFound = null;

    // Add first two weeks (known data)
    const today = new Date();
    const week1Date = new Date(today);
    week1Date.setDate(today.getDate() - 14); // 2 weeks ago

    const week2Date = new Date(today);
    week2Date.setDate(today.getDate() - 7); // 1 week ago

    // Week 1
    totalSales += week1Sales;
    projectionData.push({
      week: 1,
      date: week1Date.toISOString().split("T")[0],
      weeklySales: week1Sales,
      totalSales: totalSales,
      remainingStock: selectedVariant.stock - totalSales,
    });

    // Week 2
    totalSales += week2Sales;
    projectionData.push({
      week: 2,
      date: week2Date.toISOString().split("T")[0],
      weeklySales: week2Sales,
      totalSales: totalSales,
      remainingStock: selectedVariant.stock - totalSales,
    });

    // Project future weeks
    let weekCounter = 3;
    const currentDate = new Date(today);
    let previousWeeklySales = week2Sales;

    while (totalSales < selectedVariant.stock && weekCounter <= 30) {
      // Limit to 30 weeks for projection
      // Calculate projected sales using the growth model
      // p(t) = p0 * e^(kt)
      // For weekly sales, we use the previous week's sales and apply growth
      const projectedWeeklySales = Math.round(
        previousWeeklySales * Math.exp(growthRate)
      );
      totalSales += projectedWeeklySales;

      // Check if stock will be depleted this week
      if (totalSales >= selectedVariant.stock && !stockOutWeekFound) {
        stockOutWeekFound = weekCounter;
      }

      projectionData.push({
        week: weekCounter,
        date: currentDate.toISOString().split("T")[0],
        weeklySales: projectedWeeklySales,
        totalSales: totalSales,
        remainingStock: Math.max(0, selectedVariant.stock - totalSales),
      });

      currentDate.setDate(currentDate.getDate() + 7);
      weekCounter++;
      previousWeeklySales = projectedWeeklySales;
    }

    // If we didn't find a stock out week but reached our limit
    if (!stockOutWeekFound && totalSales >= selectedVariant.stock) {
      stockOutWeekFound = weekCounter - 1;
    }

    setProjections(projectionData);
    setStockOutWeek(stockOutWeekFound);
    setHasCalculated(true);

    // Simular un pequeño retraso para mostrar la animación de carga
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Chart data and options
  const chartData = {
    labels: projections.map((p) => `Semana ${p.week}`),
    datasets: [
      {
        label: "Ventas Semanales",
        data: projections.map((p) => p.weeklySales),
        borderColor: "#FF6B6B",
        backgroundColor: "rgba(255, 107, 107, 0.2)",
        tension: 0.1,
      },
      {
        label: "Ventas Acumuladas",
        data: projections.map((p) => p.totalSales),
        borderColor: "#4ECDC4",
        backgroundColor: "rgba(78, 205, 196, 0.2)",
        tension: 0.1,
        borderWidth: 3,
      },
      {
        label: "Stock Restante",
        data: projections.map((p) => p.remainingStock),
        borderColor: "#1A535C",
        backgroundColor: "rgba(26, 83, 92, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Proyección de Ventas y Stock",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Unidades",
        },
      },
      x: {
        title: {
          display: true,
          text: "Semana",
        },
      },
    },
  };

  // Filtrar y ordenar proyecciones
  const filteredAndSortedProjections = projections
    .filter(
      (projection) =>
        `Semana ${projection.week}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(projection.date)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        projection.totalSales.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy.value === "week") {
        return sortBy.direction === "asc" ? a.week - b.week : b.week - a.week;
      } else if (sortBy.value === "totalSales") {
        return sortBy.direction === "asc"
          ? a.totalSales - b.totalSales
          : b.totalSales - a.totalSales;
      }
      return 0;
    });

  // Cálculo de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedProjections.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    filteredAndSortedProjections.length / itemsPerPage
  );

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-8 ">
      {/* Encabezado de Página */}
      <div className="bg-blue-600 text-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pronóstico de Inventario</h1>
              <p className="text-gray-100">
                Analiza y proyecta el agotamiento de stock basado en ventas
                históricas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selección de Producto */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-white p-6 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Selección de Producto
              </h1>
              <p className="text-blue-700">
                Seleccione un producto para ver sus variantes
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-md mx-auto">
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Producto
            </label>
            <select
              id="product"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedProductId || ""}
              onChange={handleProductChange}
            >
              <option value="">Seleccionar Producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Variantes */}
      {selectedProductId && filteredVariants.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-white p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Variantes del Producto
                </h1>
                <p className="text-blue-700">
                  Seleccione una variante para realizar la proyección
                </p>
              </div>
              {selectedVariant && (
                <button
                  onClick={calculateProjections}
                  disabled={isRefreshing}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-2 ${
                    !isRefreshing
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Calculando...</span>
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5" />
                      <span>Calcular Proyección</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-50 dark:bg-indigo-900/30">
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                    Variante
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                    Talla
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                    Color
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                    Ventas Totales
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredVariants.map((variant, index) => (
                  <tr
                    key={variant.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-indigo-50/30 dark:bg-indigo-900/10"
                    } ${
                      selectedVariant?.id === variant.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    } hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer`}
                    onClick={() => handleVariantSelect(variant)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                        #{variant.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {variant.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor:
                              variant.color === "Blanco"
                                ? "#FFFFFF"
                                : variant.color === "Azul"
                                ? "#3B82F6"
                                : variant.color === "Rojo"
                                ? "#EF4444"
                                : variant.color === "Negro"
                                ? "#111827"
                                : variant.color === "Gris"
                                ? "#6B7280"
                                : variant.color === "Verde"
                                ? "#10B981"
                                : "#CCCCCC",
                          }}
                        ></div>
                        {variant.color}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {variant.stock} unidades
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                        {variant.salesWeek2} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVariantSelect(variant);
                        }}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                          selectedVariant?.id === variant.id
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50"
                        }`}
                      >
                        {selectedVariant?.id === variant.id ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Seleccionado
                          </>
                        ) : (
                          "Seleccionar"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hasCalculated && selectedVariant ? (
        <>
          {/* Información del Producto */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-white p-6 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2" />
                    Información del Producto
                  </h1>
                  <p className="text-blue-700">
                    Detalles y proyecciones para{" "}
                    {
                      products.find((p) => p.id === selectedVariant.productId)
                        ?.name
                    }{" "}
                    - {selectedVariant.size} - {selectedVariant.color}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-5 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    Stock Inicial
                  </h3>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                    {selectedVariant.stock} unidades
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-5 rounded-xl shadow-sm border border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                    Ventas Acumuladas
                  </h3>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                    {selectedVariant.salesWeek2} unidades
                  </p>
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <span className="font-medium">Semana 1:</span>{" "}
                    {selectedVariant.salesWeek1} unidades
                    <br />
                    <span className="font-medium">Semana 2:</span>{" "}
                    {selectedVariant.salesWeek2 - selectedVariant.salesWeek1}{" "}
                    unidades adicionales
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 p-5 rounded-xl shadow-sm border border-amber-200 dark:border-amber-800">
                  <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    Semana de Agotamiento
                  </h3>
                  <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                    {stockOutWeek
                      ? `Semana ${stockOutWeek}`
                      : "No se agotará en 30 semanas"}
                  </p>
                  {stockOutWeek && (
                    <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                      Fecha estimada:{" "}
                      {formatDate(
                        projections.find((p) => p.week === stockOutWeek)
                          ?.date || ""
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Gráfico */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 mx-auto">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center border-b pb-3 border-gray-200 dark:border-gray-700">
                  Gráfico de Proyección
                </h3>
                <div className="h-[500px] w-full max-w-5xl mx-auto">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Proyecciones */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-white p-6 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2 flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    Tabla de Proyecciones
                  </h1>
                  <p className="text-blue-700">
                    {filteredAndSortedProjections.length} semanas proyectadas
                  </p>
                </div>
              </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="bg-white dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar proyecciones..."
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setSearchTerm("")}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Dropdown de ordenación */}
                <div className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setShowSortOptions(!showSortOptions)}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Ordenar</span>
                    {showSortOptions ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </button>

                  {showSortOptions && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <div className="py-1">
                        {sortOptions.map((option) => (
                          <button
                            key={`${option.value}-${option.direction}`}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              sortBy.value === option.value &&
                              sortBy.direction === option.direction
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => {
                              setSortBy(option);
                              setShowSortOptions(false);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={calculateProjections}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="sr-only">Refrescar</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-50 dark:bg-indigo-900/30">
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Semana
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Ventas Semanales
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Ventas Acumuladas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Stock Restante
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.length > 0 ? (
                    currentItems.map((projection, index) => (
                      <tr
                        key={projection.week}
                        className={`${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-indigo-50/30 dark:bg-indigo-900/10"
                        } ${
                          stockOutWeek === projection.week
                            ? "bg-amber-50 dark:bg-amber-900/20"
                            : ""
                        } hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                            Semana {projection.week}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(projection.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {projection.weeklySales} unidades
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                            {projection.totalSales} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {projection.remainingStock} unidades
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {stockOutWeek === projection.week ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Agotamiento
                            </span>
                          ) : projection.week <= 2 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Datos reales
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              Proyección
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center py-6">
                          <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {searchTerm
                              ? `No se encontraron resultados para "${searchTerm}"`
                              : "No hay proyecciones disponibles"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {searchTerm
                              ? "Intenta con otro término de búsqueda"
                              : "Seleccione un producto y calcule la proyección"}
                          </p>
                          {searchTerm ? (
                            <button
                              onClick={clearSearch}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Limpiar búsqueda
                            </button>
                          ) : (
                            <button
                              onClick={calculateProjections}
                              disabled={!selectedVariant}
                              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                                selectedVariant
                                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Calcular Proyección
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {filteredAndSortedProjections.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrar
                  </span>
                  <select
                    className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    por página
                  </span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrando {indexOfFirstItem + 1} a{" "}
                  {Math.min(
                    indexOfLastItem,
                    filteredAndSortedProjections.length
                  )}{" "}
                  de {filteredAndSortedProjections.length} proyecciones
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-md text-sm text-blue-700 dark:text-blue-400 font-medium">
                      {currentPage}
                    </span>
                    <span className="mx-1 text-gray-500 dark:text-gray-400">
                      de
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {totalPages || 1}
                    </span>
                  </div>

                  <button
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => paginate(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Detalles del Modelo */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-md text-white">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              Detalles del Modelo Matemático
            </h2>
            <p className="mb-4">
              Este pronóstico utiliza un modelo de crecimiento exponencial
              basado en la ecuación diferencial dp/dt = kp, donde k ={" "}
              {Math.log(
                (selectedVariant.salesWeek2 - selectedVariant.salesWeek1) /
                  selectedVariant.salesWeek1
              ).toFixed(3)}{" "}
              para esta variante de producto.
            </p>
            <div className="mt-4 p-4 bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-teal-300">
                Resumen del Cálculo:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Stock inicial:{" "}
                      <span className="font-semibold text-blue-300">
                        {selectedVariant.stock} unidades
                      </span>
                    </li>
                    <li>
                      Ventas semana 1:{" "}
                      <span className="font-semibold text-blue-300">
                        {selectedVariant.salesWeek1} unidades
                      </span>
                    </li>
                    <li>
                      Ventas semana 2:{" "}
                      <span className="font-semibold text-blue-300">
                        {selectedVariant.salesWeek2 -
                          selectedVariant.salesWeek1}{" "}
                        unidades adicionales
                      </span>
                    </li>
                    <li>
                      Total acumulado semana 2:{" "}
                      <span className="font-semibold text-blue-300">
                        {selectedVariant.salesWeek2} unidades
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Tasa de crecimiento (k):{" "}
                      <span className="font-semibold text-teal-300">
                        {Math.log(
                          (selectedVariant.salesWeek2 -
                            selectedVariant.salesWeek1) /
                            selectedVariant.salesWeek1
                        ).toFixed(3)}
                      </span>
                    </li>
                    {stockOutWeek && (
                      <>
                        <li>
                          Semana de agotamiento:{" "}
                          <span className="font-semibold text-amber-300">
                            Semana {stockOutWeek}
                          </span>
                        </li>
                        <li>
                          Ventas acumuladas en semana {stockOutWeek}:{" "}
                          <span className="font-semibold text-amber-300">
                            {
                              projections.find((p) => p.week === stockOutWeek)
                                ?.totalSales
                            }{" "}
                            unidades
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : !selectedProductId ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="flex flex-col items-center py-6">
            <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Seleccione un producto
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Para comenzar, seleccione un producto del menú desplegable y luego
              elija una variante específica para realizar la proyección.
            </p>
          </div>
        </div>
      ) : selectedProductId && !selectedVariant ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="flex flex-col items-center py-6">
            <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Seleccione una variante
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Ahora seleccione una variante específica de la tabla para
              continuar con la proyección de inventario.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="flex flex-col items-center py-6">
            <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Calcule la proyección
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Haga clic en "Calcular Proyección" para ver los resultados de la
              proyección de inventario.
            </p>
            <button
              onClick={calculateProjections}
              disabled={!selectedVariant || isRefreshing}
              className={`px-6 py-3 rounded-lg font-medium text-lg transition-all flex items-center gap-2 ${
                selectedVariant && !isRefreshing
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Calculando...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>Calcular Proyección</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoStatusSales;
