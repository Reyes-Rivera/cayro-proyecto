"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  ArrowLeft,
  Check,
  AlertTriangle,
  ZoomIn,
  Info,
  Package,
  Award,
  Share2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { getProductByName } from "@/api/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Color, Product } from "../../../types/products";
import { useCart } from "@/context/CartConrexr";

export default function ProductDetail() {
  const params = useParams<{ name: string }>();
  const productName = params.name;
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showColorTooltip, setShowColorTooltip] = useState<number | null>(null);
  const { addItem, loading: cartLoading } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        if (!productName) {
          throw new Error("Invalid product ID");
        }
        const { data } = await getProductByName(productName);
        if (error) {
          setError(error);
        } else if (data) {
          setProduct(data);
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

    if (productName) {
      fetchProduct();
    }
  }, [productName]);

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

  // Get all images for the selected variant with proper angle handling
  const getVariantImages = () => {
    const selectedVariant = getSelectedVariant();
    if (!selectedVariant) return [];
    return selectedVariant.images || [];
  };

  // Get ordered images with placeholders for missing angles
  const getOrderedImages = () => {
    const variantImages = getVariantImages();

    // Define the required angles in order
    const requiredAngles = ["front", "side", "back"];

    return requiredAngles.map((angle) => {
      const foundImage = variantImages.find((img) => img.angle === angle);
      return (
        foundImage || {
          id: `placeholder-${angle}`,
          url: `/placeholder.svg?height=600&width=600&text=${angle}`,
          angle: angle,
          productVariantId: selectedVariant?.id || 0,
        }
      );
    });
  };

  // Handle color selection
  const handleColorSelect = (colorId: number) => {
    setSelectedColorId(colorId);
    setSelectedImageIndex(0);
    const sizesForColor = product?.variants
      .filter((v) => v.colorId === colorId)
      .map((v) => v.sizeId);
    if (sizesForColor && !sizesForColor.includes(selectedSizeId as number)) {
      setSelectedSizeId(sizesForColor[0]);
    }
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;
    try {
      await addItem(product, selectedVariant, quantity);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!selectedVariant || !product) return;
    try {
      setIsBuyingNow(true);
      // Add to cart first
      await addItem(product, selectedVariant, quantity);
      // Navigate to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error during buy now:", error);
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Navigate images
  const nextImage = () => {
    const orderedImages = getVariantImages();
    setSelectedImageIndex((prev) => (prev + 1) % orderedImages.length);
  };

  const prevImage = () => {
    const orderedImages = getVariantImages();
    setSelectedImageIndex(
      (prev) => (prev - 1 + orderedImages.length) % orderedImages.length
    );
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 flex items-center justify-center p-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20 dark:border-gray-700/20">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "No pudimos encontrar el producto que estás buscando."}
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Volver a productos</span>
          </Link>
        </div>
      </div>
    );
  }

  const uniqueColors = getUniqueColors();
  const availableSizes = getAvailableSizes();
  const selectedVariant = getSelectedVariant();
  const orderedImages = getOrderedImages();

  const tabs = [
    { id: "description", label: "Descripción", icon: Info },
    { id: "specifications", label: "Información Adicional", icon: Package },
    { id: "care", label: "Reseñas", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/productos"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Volver a productos</span>
          </Link>
          <Breadcrumbs />
        </div>

        {/* Main Content */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-10">
            {/* Image Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl overflow-hidden group max-w-md mx-auto shadow-xl border border-gray-200/50 dark:border-gray-600/50">
                <img
                  src={
                    orderedImages[selectedImageIndex]?.url ||
                    "/placeholder.svg?height=600&width=600"
                  }
                  alt={`${product.name} - ${
                    orderedImages[selectedImageIndex]?.angle ||
                    "Vista principal"
                  }`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  onClick={() => setShowZoomModal(true)}
                />

                {/* Navigation Arrows */}
                {orderedImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 p-3 rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </>
                )}

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 justify-center">
                {orderedImages.map((image, index) => (
                  <div
                    key={image?.id || index}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                        selectedImageIndex === index
                          ? "border-blue-500 ring-2 ring-blue-500/30 shadow-blue-500/20"
                          : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={`${product.name} - ${image.angle}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">
                      {image.angle === "front"
                        ? "Frontal"
                        : image.angle === "side"
                        ? "Lateral"
                        : image.angle === "back"
                        ? "Trasera"
                        : image.angle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                {/* Product Tags */}
                <div className="flex items-center gap-2 mb-4">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                  >
                    {product.category.name}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                  >
                    {product.gender.name}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                  >
                    Moda
                  </motion.span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 shadow-inner">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    $
                    {selectedVariant ? selectedVariant.price.toFixed(2) : "N/A"}
                  </span>
                  {selectedVariant && selectedVariant.price < 100 && (
                    <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                      ${(selectedVariant.price * 1.5).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Information */}
              <div className="flex items-center gap-3">
                {selectedVariant && (
                  <>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      Stock disponible:
                    </span>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-sm font-semibold px-3 py-1 rounded-full shadow-sm ${
                        selectedVariant.stock > 10
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                          : selectedVariant.stock > 0
                          ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                          : "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                      }`}
                    >
                      {selectedVariant.stock > 0
                        ? `${selectedVariant.stock} unidades`
                        : "Agotado"}
                    </motion.span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </p>

              {/* Color Selection */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                  Color
                  <span className="font-normal text-gray-600 text-base">
                    {selectedColorId
                      ? uniqueColors.find((c) => c.id === selectedColorId)?.name
                      : "Seleccionar"}
                  </span>
                </h3>
                <div className="flex gap-4">
                  {uniqueColors.map((color) => (
                    <div key={color.id} className="relative">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleColorSelect(color.id)}
                        onMouseEnter={() => setShowColorTooltip(color.id)}
                        onMouseLeave={() => setShowColorTooltip(null)}
                        className={`w-12 h-12 rounded-full border-3 transition-all duration-300 shadow-lg hover:shadow-xl ${
                          selectedColorId === color.id
                            ? "border-blue-500 ring-4 ring-blue-500/30 scale-110"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor:
                            color.hexValue || colorMap[color.name] || "#6B7280",
                        }}
                      />
                      <AnimatePresence>
                        {showColorTooltip === color.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-xl"
                          >
                            {color.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
                    Talla
                    <span className="font-normal text-gray-600 text-base">
                      {selectedSizeId
                        ? availableSizes.find((s) => s.id === selectedSizeId)
                            ?.name
                        : "Seleccionar"}
                    </span>
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-sm text-blue-600 hover:text-blue-700 underline font-medium transition-colors duration-300">
                        Ver Guía de Tallas
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Guía de tallas</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-sm mb-4">
                          <p className="font-medium text-blue-900 mb-2">
                            Cómo medir
                          </p>
                          <ul className="list-disc pl-4 space-y-1 text-blue-700 text-xs">
                            <li>Pecho: Mide alrededor de la parte más ancha</li>
                            <li>
                              Cintura: Mide alrededor de la parte más estrecha
                            </li>
                          </ul>
                        </div>
                        <table className="w-full text-xs border rounded">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-2 px-2 text-left">Talla</th>
                              <th className="py-2 px-2 text-left">Pecho</th>
                              <th className="py-2 px-2 text-left">Cintura</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr>
                              <td className="py-1 px-2">S</td>
                              <td className="py-1 px-2">86-90</td>
                              <td className="py-1 px-2">70-74</td>
                            </tr>
                            <tr>
                              <td className="py-1 px-2">M</td>
                              <td className="py-1 px-2">90-94</td>
                              <td className="py-1 px-2">74-78</td>
                            </tr>
                            <tr>
                              <td className="py-1 px-2">L</td>
                              <td className="py-1 px-2">94-98</td>
                              <td className="py-1 px-2">78-82</td>
                            </tr>
                            <tr>
                              <td className="py-1 px-2">XL</td>
                              <td className="py-1 px-2">98-102</td>
                              <td className="py-1 px-2">82-86</td>
                            </tr>
                            <tr>
                              <td className="py-1 px-2">XXL</td>
                              <td className="py-1 px-2">102-106</td>
                              <td className="py-1 px-2">86-90</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-3">
                  {availableSizes.map((size) => (
                    <motion.button
                      key={size.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`px-6 py-3 text-sm font-semibold border-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                        selectedSizeId === size.id
                          ? "border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105 shadow-blue-500/30"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {size.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-inner">
                <div className="flex items-center gap-6">
                  {/* Quantity selector */}
                  <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 rounded-l-xl transition-all duration-300"
                    >
                      <Minus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                    <span className="px-6 py-3 font-bold text-gray-900 dark:text-white min-w-[60px] text-center text-lg">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={increaseQuantity}
                      disabled={
                        !selectedVariant || quantity >= selectedVariant.stock
                      }
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 rounded-r-xl transition-all duration-300"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 flex-1">
                    {product && selectedVariant ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={cartLoading}
                        className={`p-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                          isAddedToCart
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                        } disabled:opacity-50`}
                      >
                        {cartLoading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : isAddedToCart ? (
                          <Check className="w-6 h-6" />
                        ) : (
                          <ShoppingCart className="w-6 h-6" />
                        )}
                      </motion.button>
                    ) : (
                      <button
                        disabled
                        className="p-4 bg-gray-300 text-gray-500 rounded-xl font-medium cursor-not-allowed shadow-sm"
                      >
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                    )}

                    {product && selectedVariant ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyNow}
                        disabled={isBuyingNow}
                        className="flex-1 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 py-4 px-6 rounded-xl font-bold hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                      >
                        {isBuyingNow ? (
                          <>
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                          </>
                        ) : (
                          "Comprar Ahora"
                        )}
                      </motion.button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 bg-gray-300 text-gray-500 py-4 px-8 rounded-xl font-bold cursor-not-allowed shadow-sm"
                      >
                        Comprar Ahora
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Meta */}
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Compartir:</span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>

            <div className="p-6 bg-white dark:bg-gray-800">
              {activeTab === "description" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      100% Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      Ut at risus vel nisi gravida dictum
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      Donec non velit vel nunc faucibus auctor
                    </li>
                    <li className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      Sed fermentum lorem ut dui posuere fringilla
                    </li>
                  </ul>
                </motion.div>
              )}
              {activeTab === "specifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">
                      Material:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      100% Algodón
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">
                      Manga:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {product.sleeve.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">
                      Género:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {product.gender.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Categoría:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {product.category.name}
                    </span>
                  </div>
                </motion.div>
              )}
              {activeTab === "care" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-600 dark:text-gray-300 space-y-2"
                >
                  <p>• Lavar a máquina en agua fría</p>
                  <p>• No usar blanqueador</p>
                  <p>• Secar a temperatura baja</p>
                  <p>• Planchar a temperatura media</p>
                  <p>• No lavar en seco</p>
                  <p>• Separar colores oscuros y claros</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
        <DialogContent className="sm:max-w-4xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Vista ampliada
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <img
              src={
                orderedImages[selectedImageIndex]?.url ||
                "/placeholder.svg?height=1000&width=1000"
              }
              alt={`${product.name} - ${
                orderedImages[selectedImageIndex]?.angle || "Vista principal"
              }`}
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
