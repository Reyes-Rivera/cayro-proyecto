"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Star,
  AlertTriangle,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import {
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { getProductByName } from "@/api/products";
import ProductRecommendationsCarousel from "./components/ProductRecommendations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Color, Product } from "../../../types/products";
import { useCart } from "@/context/CartContext";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

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
  const { addItem } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

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

  // Get all available images for the selected variant
  const getVariantImages = () => {
    const selectedVariant = getSelectedVariant();
    if (!selectedVariant || !selectedVariant.images) return [];
    return selectedVariant.images.filter((img) => img && img.url);
  };

  // Get images with proper fallback handling
  const getDisplayImages = () => {
    const variantImages = getVariantImages();
    if (variantImages.length > 0) {
      return variantImages;
    }
    return [
      {
        id: "placeholder-default",
        url: `/placeholder.svg?height=600&width=600&text=Sin+imagen`,
        angle: "front",
        productVariantId: getSelectedVariant()?.id || 0,
      },
    ];
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
      setIsAddingToCart(true);
      await addItem(product, selectedVariant, quantity);
      setIsAddedToCart(true);
      AlertHelper.success({
        message: "Producto añadido al carrito",
        title: "¡Éxito!",
        timer: 3000,
        animation: "slideIn",
      });
      setTimeout(() => setIsAddedToCart(false), 2000);
    } catch (error: any) {
      AlertHelper.error({
        title: "Error al agregar al carrito",
        message:
          error.response?.data?.message ||
          "No se pudo añadir el producto al carrito.",
        timer: 4000,
        animation: "slideIn",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    if (!selectedVariant || !product) return;
    try {
      setIsBuyingNow(true);
      await addItem(product, selectedVariant, quantity);
      AlertHelper.success({
        message: "Producto añadido al carrito",
        title: "¡Listo para comprar!",
        timer: 2000,
        animation: "slideIn",
      });
      navigate("/checkout");
    } catch (error: any) {
      AlertHelper.error({
        title: "Error al comprar",
        message:
          error.response?.data?.message || "No se pudo completar la compra.",
        timer: 4000,
        animation: "slideIn",
      });
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Handle share functionality
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setUrlCopied(true);
      AlertHelper.success({
        message: "URL copiada al portapapeles",
        title: "¡Copiado!",
        timer: 2000,
        animation: "slideIn",
      });
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      AlertHelper.error({
        message: "No se pudo copiar la URL",
        title: "Error",
        error,
        timer: 2000,
        animation: "slideIn",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `¡Mira este increíble producto: ${product?.name || ""}!`
    );

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text} ${url}`;
        break;
      case "instagram":
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        handleCopyUrl();
        AlertHelper.info({
          message: "URL copiada. Pégala en tu historia de Instagram",
          title: "Instagram",
          timer: 3000,
          animation: "slideIn",
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
    setShowShareDropdown(false);
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

  const uniqueColors = getUniqueColors();
  const availableSizes = getAvailableSizes();
  const selectedVariant = getSelectedVariant();
  const displayImages = getDisplayImages();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showShareDropdown && !target.closest(".relative")) {
        setShowShareDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareDropdown]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {error || "No pudimos encontrar el producto que estás buscando."}
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs />
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Images */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              {/* Main Image */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 sm:p-8 mb-4 sm:mb-6 aspect-square flex items-center justify-center">
                <img
                  src={
                    displayImages[selectedImageIndex]?.url || "/placeholder.svg"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={() => setShowZoomModal(true)}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {displayImages.map((image, index) => (
                  <button
                    key={image?.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-blue-500 scale-110 shadow-lg"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-contain bg-gray-100 dark:bg-gray-700"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50 dark:bg-gray-800/50">
              {/* Category Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full mb-4">
                {product.category?.name || "Producto"}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  (24 reseñas)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    $
                    {selectedVariant ? selectedVariant.price.toFixed(2) : "N/A"}
                  </span>
                  {selectedVariant && selectedVariant.price < 129.99 && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      ${(selectedVariant.price * 1.2).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Stock:{" "}
                    <span className="font-semibold">
                      {selectedVariant?.stock || 0}
                    </span>{" "}
                    disponibles
                  </span>
                  {selectedVariant &&
                    selectedVariant.stock <= 5 &&
                    selectedVariant.stock > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        ¡Últimas unidades!
                      </span>
                    )}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Color:{" "}
                  {selectedColorId
                    ? uniqueColors.find((c) => c.id === selectedColorId)?.name
                    : ""}
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {uniqueColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color.id)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all ${
                        selectedColorId === color.id
                          ? "border-blue-500 scale-110 shadow-lg"
                          : "border-gray-300 dark:border-gray-600 hover:scale-105"
                      }`}
                      style={{
                        backgroundColor:
                          color.hexValue || colorMap[color.name] || "#6B7280",
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Talla:{" "}
                  {selectedSizeId
                    ? availableSizes.find((s) => s.id === selectedSizeId)?.name
                    : ""}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`py-2 sm:py-3 px-2 sm:px-4 border-2 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                        selectedSizeId === size.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  Cantidad
                </h3>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <span className="px-3 sm:px-6 py-2 sm:py-3 font-semibold text-base sm:text-lg min-w-[40px] sm:min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={
                        !selectedVariant || quantity >= selectedVariant.stock
                      }
                      className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Máximo {selectedVariant?.stock || 0} disponibles
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    isAddingToCart ||
                    !selectedVariant ||
                    selectedVariant.stock <= 0
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors shadow-lg"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Agregando...
                    </>
                  ) : isAddedToCart ? (
                    <>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      ¡Agregado!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      Agregar al carrito
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={
                    isBuyingNow ||
                    !selectedVariant ||
                    selectedVariant.stock <= 0
                  }
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-colors"
                >
                  {isBuyingNow ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : (
                    "Comprar ahora"
                  )}
                </button>

                {/* Share Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowShareDropdown(!showShareDropdown)}
                    className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Compartir producto
                  </button>

                  {/* Share Dropdown */}
                  {showShareDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4">
                      {/* Close button */}
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => setShowShareDropdown(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex justify-center items-center gap-4 mb-4">
                        <button
                          onClick={() => handleSocialShare("facebook")}
                          className="p-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Compartir en Facebook"
                        >
                          <Facebook className="w-6 h-6 text-[#1877F2]" />
                        </button>

                        <button
                          onClick={() => handleSocialShare("twitter")}
                          className="p-3 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                          title="Compartir en Twitter"
                        >
                          <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                        </button>

                        <button
                          onClick={() => handleSocialShare("whatsapp")}
                          className="p-3 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          title="Compartir en WhatsApp"
                        >
                          <MessageCircle className="w-6 h-6 text-[#25D366]" />
                        </button>

                        <button
                          onClick={() => handleSocialShare("instagram")}
                          className="p-3 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                          title="Compartir en Instagram"
                        >
                          <Instagram className="w-6 h-6 text-[#E4405F]" />
                        </button>
                      </div>

                      {/* Copy URL */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="flex gap-2">
                          <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 min-w-0">
                            <p className="text-gray-600 dark:text-gray-300 text-xs truncate">
                              {window.location.href.length > 40
                                ? `${window.location.href.substring(0, 40)}...`
                                : window.location.href}
                            </p>
                          </div>
                          <button
                            onClick={handleCopyUrl}
                            className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1 text-sm flex-shrink-0 ${
                              urlCopied
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {urlCopied ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                  Copiado
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span className="hidden sm:inline">Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Envío rápido
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    2-3 días hábiles
                  </p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Calidad garantizada
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Materiales premium
                  </p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    Cambios fáciles
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    30 días
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Descripción del producto
            </h2>
            <div className="prose prose-sm sm:prose prose-gray dark:prose-invert max-w-none">
              {(() => {
                const description =
                  product.description ||
                  "Playera de corte clásico con cuello redondo, diseñada para ofrecer comodidad y estilo en cualquier ocasión. Su silueta favorecedora y ajuste relajado la convierten en una prenda esencial para el uso diario. Confeccionada en un material suave y transpirable, es ideal para combinar con jeans, shorts o capas adicionales.";

                if (description.includes("•")) {
                  const items = description
                    .split("•")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0);
                  return (
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-lg">
                    {description}
                  </p>
                );
              })()}
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Especificaciones
                </h3>
                <dl className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      Tipo de cuello:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      Cuello redondo
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      Género:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      {product.gender?.name || "Unisex"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      Material:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      100% Algodón
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600 dark:text-gray-400">
                      Cuidado:
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                      Lavado a máquina
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Información adicional
                </h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                    <strong>Importante:</strong> No ofrecemos servicios de envío
                    gratuito, garantía ni devoluciones para este producto. Para
                    más información, contacte con nuestro servicio de atención
                    al cliente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="mt-8 sm:mt-16">
          <ProductRecommendationsCarousel currentProduct={product} />
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
        <DialogContent className="w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Vista ampliada - {product.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <img
              src={displayImages[selectedImageIndex]?.url || "/placeholder.svg"}
              alt={product.name}
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
          <div className="flex justify-center gap-2 sm:gap-3 pt-4 overflow-x-auto pb-2">
            {displayImages.map((image, index) => (
              <button
                key={image?.id || index}
                onClick={() => setSelectedImageIndex(index)}
                className={`border rounded-lg overflow-hidden w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 ${
                  selectedImageIndex === index
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Vista ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
