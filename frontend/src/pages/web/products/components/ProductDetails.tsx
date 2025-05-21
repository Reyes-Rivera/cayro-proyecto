"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Minus,
  Plus,
  ArrowLeft,
  Check,
  AlertTriangle,
  ShoppingCart,
  Tag,
  Ruler,
} from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { getProductById } from "@/api/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Color, Product } from "../utils/products";

// Interfaces based on the database schema


export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showColorTooltip, setShowColorTooltip] = useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (!productId) {
          throw new Error("Invalid product ID");
        }
        const { data } = await getProductById(+productId);
        if (error) {
          setError(error);
        } else if (data) {
          setProduct(data);
          // Set default selected color and size to the first available variant
          if (data.variants && data.variants.length > 0) {
            setSelectedColorId(data.variants[0].colorId);
            setSelectedSizeId(data.variants[0].sizeId);
          }
        }
      } catch {
        setError(
          "Error al cargar el producto. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Get unique colors from product variants
  const getUniqueColors = () => {
    if (!product || !product.variants) return [];

    const uniqueColorIds = [...new Set(product.variants.map((v) => v.colorId))];
    return uniqueColorIds
      .map((id) => {
        const variant = product.variants.find((v) => v.colorId === id);
        return variant ? variant.color : null;
      })
      .filter(Boolean) as Color[];
  };

  // Get available sizes for the selected color
  const getAvailableSizes = () => {
    if (!product || !product.variants || selectedColorId === null) return [];

    const variantsWithSelectedColor = product.variants.filter(
      (v) => v.colorId === selectedColorId
    );
    return variantsWithSelectedColor.map((v) => v.size);
  };

  // Get the selected variant
  const getSelectedVariant = () => {
    if (
      !product ||
      !product.variants ||
      selectedColorId === null ||
      selectedSizeId === null
    )
      return null;

    return (
      product.variants.find(
        (v) => v.colorId === selectedColorId && v.sizeId === selectedSizeId
      ) || null
    );
  };

  // Handle color selection
  const handleColorSelect = (colorId: number) => {
    setSelectedColorId(colorId);

    // If the current selected size is not available for this color, select the first available size
    const sizesForColor = product?.variants
      .filter((v) => v.colorId === colorId)
      .map((v) => v.sizeId);

    if (sizesForColor && !sizesForColor.includes(selectedSizeId as number)) {
      setSelectedSizeId(sizesForColor[0]);
    }
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    setIsAddingToCart(true);

    // Simulate adding to cart
    setTimeout(() => {
      setIsAddingToCart(false);
      setIsAddedToCart(true);

      // Reset added state after 2 seconds
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 2000);
    }, 800);
  };

  // Color map for colors without hexValue
  const colorMap: Record<string, string> = {
    Negro: "#000000",
    Blanco: "#FFFFFF",
    Azul: "#1E40AF",
    "Azul cielo": "#7DD3FC",
    "Azul marino": "#1E3A8A",
    Rojo: "#DC2626",
    Verde: "#10B981",
    Amarillo: "#FBBF24",
    Morado: "#8B5CF6",
    Rosa: "#EC4899",
    Naranja: "#F97316",
    Gris: "#6B7280",
    Marrón: "#92400E",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/30"></div>
            <div className="w-16 h-16 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 absolute top-0 left-0 animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base font-medium mt-4 bg-white dark:bg-gray-800 px-5 py-2 rounded-full shadow-md">
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full inline-flex mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "No pudimos encontrar el producto que estás buscando."}
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg transition-all duration-300"
          >
            Volver a productos
            <ChevronRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const uniqueColors = getUniqueColors();
  const availableSizes = getAvailableSizes();
  const selectedVariant = getSelectedVariant();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="w-full px-4 py-4">
        {/* Back button and breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <Link
            to="/productos"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group"
          >
            <span className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-2 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium text-sm">Volver a productos</span>
          </Link>
          <Breadcrumbs />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 flex items-center justify-center relative lg:col-span-2">
              {/* Brand badge */}
              <div className="absolute top-6 left-6 z-10">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow-md">
                    {product.brand.name}
                  </span>
                </motion.div>
              </div>

              {/* Main image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="w-full max-w-sm relative"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-gray-800 relative group shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent dark:from-blue-400/10 z-0"></div>
                  <motion.img
                    src={
                      selectedVariant?.images.find(img => img.angle === "front")?.url ||
                      "/placeholder.svg?height=800&width=800"
                    }
                    alt={product.name}
                    className="w-full h-full object-contain p-4 relative z-10 transition-transform duration-500 group-hover:scale-105"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    key={selectedVariant?.images.find(img=> img.angle==="front")?.id} // Force re-render on variant change
                  />
                </div>
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="p-6 lg:col-span-3 bg-white dark:bg-gray-900">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-4"
              >
                {/* Product title and category */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      {product.category.name}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      {product.gender.name}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full flex items-center">
                      <Tag className="w-2.5 h-2.5 mr-1" />
                      {product.sleeve.name}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {product.name}
                  </h1>

                  {/* Price and stock */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        $
                        {selectedVariant
                          ? selectedVariant.price.toFixed(2)
                          : "N/A"}
                      </span>
                    </div>

                    {selectedVariant && (
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          selectedVariant.stock > 5
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {selectedVariant.stock > 5 ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 mr-1" />
                        )}
                        {selectedVariant.stock > 5
                          ? "En stock"
                          : `Solo ${selectedVariant.stock} disponibles`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  {product.description}
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Color:{" "}
                    <span className="font-normal text-gray-500 dark:text-gray-400">
                      {selectedColorId
                        ? uniqueColors.find((c) => c.id === selectedColorId)
                            ?.name
                        : "Selecciona un color"}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {uniqueColors.map((color) => (
                      <div key={color.id} className="relative">
                        <motion.button
                          onClick={() => handleColorSelect(color.id)}
                          onMouseEnter={() => setShowColorTooltip(color.id)}
                          onMouseLeave={() => setShowColorTooltip(null)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            selectedColorId === color.id
                              ? "ring-3 ring-offset-2 ring-blue-600 dark:ring-blue-400 dark:ring-offset-gray-800"
                              : ""
                          }`}
                          aria-label={`Color: ${color.name}`}
                        >
                          <span
                            className="w-full h-full rounded-full block border border-gray-200 dark:border-gray-700 shadow-md"
                            style={{
                              backgroundColor:
                                color.hexValue ||
                                colorMap[color.name] ||
                                "#6B7280",
                            }}
                          />
                        </motion.button>

                        {/* Color name tooltip */}
                        <AnimatePresence>
                          {showColorTooltip === color.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg whitespace-nowrap z-10"
                            >
                              {color.name}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                      Talla
                    </label>

                    {/* Size Guide Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
                          <Ruler className="w-4 h-4 mr-1.5" />
                          Guía de tallas
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Guía de tallas</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                            <p className="font-medium text-blue-700 dark:text-blue-400 mb-2">
                              Cómo medir
                            </p>
                            <p className="mb-2">
                              Para encontrar tu talla perfecta, mide tu cuerpo
                              de la siguiente manera:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>
                                Pecho: Mide alrededor de la parte más ancha de
                                tu pecho.
                              </li>
                              <li>
                                Cintura: Mide alrededor de la parte más estrecha
                                de tu cintura.
                              </li>
                              <li>
                                Cadera: Mide alrededor de la parte más ancha de
                                tus caderas.
                              </li>
                            </ul>
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100 dark:bg-gray-800">
                                <tr>
                                  <th className="py-2 px-3 text-left">Talla</th>
                                  <th className="py-2 px-3 text-left">
                                    Pecho (cm)
                                  </th>
                                  <th className="py-2 px-3 text-left">
                                    Cintura (cm)
                                  </th>
                                  <th className="py-2 px-3 text-left">
                                    Cadera (cm)
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                  <td className="py-2 px-3 font-medium">XS</td>
                                  <td className="py-2 px-3">82-86</td>
                                  <td className="py-2 px-3">66-70</td>
                                  <td className="py-2 px-3">90-94</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">S</td>
                                  <td className="py-2 px-3">86-90</td>
                                  <td className="py-2 px-3">70-74</td>
                                  <td className="py-2 px-3">94-98</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">M</td>
                                  <td className="py-2 px-3">90-94</td>
                                  <td className="py-2 px-3">74-78</td>
                                  <td className="py-2 px-3">98-102</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">L</td>
                                  <td className="py-2 px-3">94-98</td>
                                  <td className="py-2 px-3">78-82</td>
                                  <td className="py-2 px-3">102-106</td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-3 font-medium">XL</td>
                                  <td className="py-2 px-3">98-102</td>
                                  <td className="py-2 px-3">82-86</td>
                                  <td className="py-2 px-3">106-110</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {availableSizes.map((size) => (
                      <motion.button
                        key={size.id}
                        onClick={() => setSelectedSizeId(size.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedSizeId === size.id
                            ? "bg-blue-600 dark:bg-blue-500 text-white shadow-md"
                            : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-blue-400 dark:hover:border-blue-500"
                        }`}
                      >
                        {size.name}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className={`w-10 h-10 rounded-l-lg flex items-center justify-center ${
                        quantity <= 1
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                          : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <input
                      type="number"
                      min="1"
                      max={selectedVariant?.stock || 1}
                      value={quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value);
                        if (
                          !isNaN(val) &&
                          val >= 1 &&
                          (!selectedVariant || val <= selectedVariant.stock)
                        ) {
                          setQuantity(val);
                        }
                      }}
                      className="w-14 h-10 text-center border-y-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={increaseQuantity}
                      disabled={
                        !selectedVariant || quantity >= selectedVariant.stock
                      }
                      className={`w-10 h-10 rounded-r-lg flex items-center justify-center ${
                        !selectedVariant || quantity >= selectedVariant.stock
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                          : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-2">
                  {product && selectedVariant ? (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full"
                    >
                      <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-base transition-all duration-300 ${
                          isAddedToCart
                            ? "bg-green-600 dark:bg-green-500 text-white"
                            : "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                        } shadow-lg hover:shadow-xl disabled:opacity-70`}
                      >
                        {isAddingToCart ? (
                          <>
                            <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                            <span>Agregando...</span>
                          </>
                        ) : isAddedToCart ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span>¡Agregado al carrito!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            <span>Agregar al carrito</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={true}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-base bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-md"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Selecciona opciones
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
