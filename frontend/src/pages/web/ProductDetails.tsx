"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  RefreshCw,
  Shield,
  Tag,
  Ruler,
  Palette,
  Shirt,
  Loader2,
  AlertTriangle,
  Users,
} from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { getProductById } from "@/api/products";

// Interfaces based on the database schema
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
  brand: Brand;
  gender: Gender;
  sleeve: Sleeve;
  category: Category;
  variants: ProductVariant[];
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
}

interface Color {
  id: number;
  name: string;
  hexValue: string;
}

interface Size {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Gender {
  id: number;
  name: string;
}

interface Sleeve {
  id: number;
  name: string;
}


export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "reviews"
  >("description");

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
            setMainImage(data.variants[0].imageUrl);
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

    // Update the main image to the first variant with this color
    const variantWithColor = product?.variants.find(
      (v) => v.colorId === colorId
    );
    if (variantWithColor) {
      setMainImage(variantWithColor.imageUrl);

      // If the current selected size is not available for this color, select the first available size
      const sizesForColor = product?.variants
        .filter((v) => v.colorId === colorId)
        .map((v) => v.sizeId);

      if (sizesForColor && !sizesForColor.includes(selectedSizeId as number)) {
        setSelectedSizeId(sizesForColor[0]);
      }
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "No pudimos encontrar el producto que estás buscando."}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md"
          >
            Volver a productos
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const uniqueColors = getUniqueColors();
  const availableSizes = getAvailableSizes();
  const selectedVariant = getSelectedVariant();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Images */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-4"
            >
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={
                    mainImage ||
                    selectedVariant?.imageUrl ||
                    "/placeholder.svg?height=600&width=600"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail gallery */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.variants
                  .filter((v) => v.colorId === selectedColorId)
                  .map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setMainImage(variant.imageUrl)}
                      className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                        mainImage === variant.imageUrl
                          ? "border-blue-500 shadow-md"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <img
                        src={
                          variant.imageUrl ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={`${product.name} - ${variant.color.name}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {product.brand.name}
                  </span>
                  <span className="mx-2 text-gray-300 dark:text-gray-600">
                    |
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.category.name}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    (24 reseñas)
                  </span>
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  ${selectedVariant ? selectedVariant.price.toFixed(2) : "N/A"}
                  {selectedVariant && selectedVariant.stock < 5 && (
                    <span className="ml-3 text-sm font-medium text-red-600 dark:text-red-400">
                      ¡Solo {selectedVariant.stock} en stock!
                    </span>
                  )}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Palette className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Color:{" "}
                  <span className="ml-2 font-normal text-gray-600 dark:text-gray-400">
                    {selectedColorId
                      ? uniqueColors.find((c) => c.id === selectedColorId)?.name
                      : "Selecciona un color"}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color.id)}
                      className={`w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 ${
                        selectedColorId === color.id
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : ""
                      }`}
                      style={{ backgroundColor: color.hexValue }}
                      aria-label={`Color: ${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <Ruler className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Talla:{" "}
                  <span className="ml-2 font-normal text-gray-600 dark:text-gray-400">
                    {selectedSizeId
                      ? availableSizes.find((s) => s.id === selectedSizeId)
                          ?.name
                      : "Selecciona una talla"}
                  </span>
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        selectedSizeId === size.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Cantidad
                </h3>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-l-md ${
                      quantity <= 1
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
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
                    className="w-16 text-center py-2 border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={increaseQuantity}
                    disabled={
                      !selectedVariant || quantity >= selectedVariant.stock
                    }
                    className={`p-2 rounded-r-md ${
                      !selectedVariant || quantity >= selectedVariant.stock
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium ${
                    !selectedVariant || selectedVariant.stock === 0
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {!selectedVariant || selectedVariant.stock === 0
                    ? "Agotado"
                    : "Añadir al carrito"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Product Features */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Envío gratuito
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      En pedidos superiores a $50
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Devoluciones sencillas
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      30 días para devoluciones
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Garantía de calidad
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Productos de alta calidad garantizados
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "description"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Descripción
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "details"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Detalles
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "reviews"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Reseñas
              </button>
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="prose prose-lg max-w-none dark:prose-invert"
                  >
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {product.description}
                    </div>
                  </motion.div>
                )}

                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Marca
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {product.brand.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <Shirt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Categoría
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {product.category.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Género
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {product.gender.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Colores disponibles
                            </h4>
                            <div className="flex gap-1 mt-1">
                              {uniqueColors.map((color) => (
                                <div
                                  key={color.id}
                                  className="w-5 h-5 rounded-full"
                                  style={{ backgroundColor: color.hexValue }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <Ruler className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Tallas disponibles
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {[
                                ...new Set(
                                  product.variants.map((v) => v.size.name)
                                ),
                              ].join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Última actualización
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {new Date(product.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Reseñas de clientes
                      </h3>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                        Escribir una reseña
                      </button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Aún no hay reseñas para este producto. ¡Sé el primero en
                        compartir tu opinión!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Productos relacionados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* This would be populated with actual related products */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={`/placeholder.svg?height=400&width=300&text=Producto+${i}`}
                    alt={`Producto relacionado ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Producto relacionado {i}
                  </h3>
                  <div className="flex items-center mt-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-3 h-3 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    $19.99
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
