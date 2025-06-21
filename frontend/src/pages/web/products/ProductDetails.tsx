"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Share2 } from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { getProductByName } from "@/api/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Color, Product } from "../../../types/products";
import { useCart } from "@/context/CartContext";

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
      setTimeout(() => setIsAddedToCart(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
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
      navigate("/checkout");
    } catch (error) {
      console.error("Error during buy now:", error);
    } finally {
      setIsBuyingNow(false);
    }
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
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Cargando producto...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
          <div className="text-red-500 mx-auto mb-4 text-5xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "No pudimos encontrar el producto que estás buscando."}
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const uniqueColors = getUniqueColors();
  const availableSizes = getAvailableSizes();
  const selectedVariant = getSelectedVariant();
  const displayImages = getDisplayImages();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-4">
              <img
                src={
                  displayImages[selectedImageIndex]?.url || "/placeholder.svg"
                }
                alt={product.name}
                className="w-full h-auto object-contain"
                onClick={() => setShowZoomModal(true)}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4">
              {displayImages.map((image, index) => (
                <button
                  key={image?.id || index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border rounded-md overflow-hidden w-20 h-20 flex items-center justify-center ${
                    selectedImageIndex === index
                      ? "border-indigo-600 dark:border-indigo-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`${product.name} - vista ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Category and Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                <Link to="/playeras" className="hover:underline">
                  Playeras
                </Link>
                <span>•</span>
                <Link to="/playeras/mujer" className="hover:underline">
                  Mujer
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>

              {/* Ratings */}
              {/* No ratings section */}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${selectedVariant ? selectedVariant.price.toFixed(2) : "N/A"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Precio por unidad • Stock disponible:{" "}
                {selectedVariant?.stock || 0} unidades
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="mb-2">
                <span className="font-medium">Color: </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedColorId
                    ? uniqueColors.find((c) => c.id === selectedColorId)?.name
                    : ""}
                </span>
              </div>
              <div className="flex gap-2">
                {uniqueColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorSelect(color.id)}
                    className={`w-10 h-10 rounded-full relative border border-gray-300 ${
                      selectedColorId === color.id
                        ? "ring-2 ring-offset-2 ring-indigo-600"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        color.hexValue || colorMap[color.name] || "#6B7280",
                    }}
                    aria-label={`Color ${color.name}`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="mb-2">
                <span className="font-medium">Talla: </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedSizeId
                    ? availableSizes.find((s) => s.id === selectedSizeId)?.name
                    : ""}
                </span>
              </div>
              <div className="flex gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSizeId(size.id)}
                    className={`min-w-[60px] py-2 px-4 border rounded-md text-center ${
                      selectedSizeId === size.id
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <div className="flex items-center">
                <div className="border border-gray-300 dark:border-gray-600 rounded-md flex items-center bg-white dark:bg-gray-800">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-gray-700 dark:text-gray-300 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={
                      !selectedVariant || quantity >= selectedVariant.stock
                    }
                    className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                  Máximo {selectedVariant?.stock || 0} disponibles
                </span>
              </div>
            </div>

            {/* Add to Cart and Buy Now */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={
                  isAddingToCart ||
                  !selectedVariant ||
                  selectedVariant.stock <= 0
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Agregando...
                  </>
                ) : isAddedToCart ? (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Agregado
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al carrito
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={
                  isBuyingNow || !selectedVariant || selectedVariant.stock <= 0
                }
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
              >
                {isBuyingNow ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  "Comprar ahora"
                )}
              </button>
            </div>

            {/* Shipping and Returns */}
            {/* Information Notice */}
            <div className="py-6 border-t border-b">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-medium">Importante:</span> No ofrecemos
                  servicios de envío gratuito, garantía ni devoluciones para
                  este producto.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Para más información sobre nuestras políticas, por favor
                  contacte con nuestro servicio de atención al cliente.
                </p>
              </div>
            </div>

            {/* Share Button */}
            <div className="mt-6 pt-6 border-t">
              <button className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 bg-white dark:bg-gray-900">
                <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Compartir producto
                </span>
              </button>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Descripción del producto
              </h2>
              {/* Helper function to render description with bullet points */}
              {(() => {
                const description =
                  product.description ||
                  "Playera de corte clásico con cuello redondo, diseñada para ofrecer comodidad y estilo en cualquier ocasión. Su silueta favorecedora y ajuste relajado la convierten en una prenda esencial para el uso diario. Confeccionada en un material suave y transpirable, es ideal para combinar con jeans, shorts o capas adicionales. Perfecta tanto para un look casual como para complementar outfits más elaborados. Disponible en una amplia variedad de colores.";

                // Check if description contains bullet points
                if (description.includes("•")) {
                  // Split by bullet points and clean up
                  const items = description
                    .split("•")
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0);

                  return (
                    <ul className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-600 dark:text-indigo-400 mr-2 mt-1">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Fallback to regular paragraph if no bullet points
                return (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                );
              })()}

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Tipo de cuello
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    Cuello redondo
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Género
                  </h3>
                  <p className="text-gray-900 dark:text-white">Mujer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
        <DialogContent className="sm:max-w-4xl dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>Vista ampliada</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <img
              src={displayImages[selectedImageIndex]?.url || "/placeholder.svg"}
              alt={product.name}
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
