/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useForm, Controller } from "react-hook-form";
import type {
  Product,
  Size,
  Brand,
  Gender,
  Category,
  NeckType,
  Color,
  CreateProductDto,
  ProductVariantDto,
  Images,
} from "../data/sampleData";
import {
  Package,
  Info,
  Palette,
  Tag,
  Plus,
  X,
  ArrowLeft,
  ShoppingBag,
  Ruler,
  DollarSign,
  Layers,
  ImageIcon,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Package2,
  Check,
  HelpCircle,
  ArrowRight,
  Camera,
  Eye,
  Upload,
} from "lucide-react";
import {
  createProduct,
  updateProduct,
  getBrands,
  getCategories,
  getColors,
  getGenders,
  getSizes,
  getSleeve,
} from "@/api/products";

// Definir los tipos de ángulos disponibles
type ImageAngle = "front" | "side" | "back";

// Extender la interfaz Images para incluir el ángulo
interface ExtendedImage extends Images {
  angle: ImageAngle;
  isNew?: boolean; // Para identificar imágenes nuevas que pueden ser eliminadas de Cloudinary
}

interface ColorSizeConfig {
  colorId: number;
  sizes: number[];
  prices: { [key: number]: number };
  stocks: { [key: number]: number };
  variantIds: { [key: number]: number };
  images: ExtendedImage[];
}

interface ProductFormProps {
  onAdd: (newProduct: Product) => Promise<void>;
  product?: Product;
  onEdit: (updatedProduct: Product) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onCancel,
  onAdd,
  onEdit,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateProductDto>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      active: product?.active ?? true,
      brandId: product?.brandId || undefined,
      genderId: product?.genderId || undefined,
      sleeveId: product?.sleeveId || undefined,
      categoryId: product?.categoryId || undefined,
      variants: [],
    },
  });

  // Estado para el flujo del formulario
  const [formStep, setFormStep] = useState<number>(0);
  const [colorConfigs, setColorConfigs] = useState<ColorSizeConfig[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [sizes, setSizes] = useState<Size[]>();
  const [brands, setBrands] = useState<Brand[]>();
  const [genders, setGenders] = useState<Gender[]>();
  const [category, setCategory] = useState<Category[]>();
  const [neckType, setNeckType] = useState<NeckType[]>();
  const [colors, setColors] = useState<Color[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingAngle, setUploadingAngle] = useState<ImageAngle | null>(null);

  // Pagination for variants table
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const watchName = watch("name");
  const watchDescription = watch("description");
  const watchBrandId = watch("brandId");
  const watchGenderId = watch("genderId");
  const watchCategoryId = watch("categoryId");
  const watchSleeveId = watch("sleeveId");

  // Validar si la información básica está completa
  const isBasicInfoComplete =
    watchName &&
    watchDescription &&
    watchBrandId &&
    watchGenderId &&
    watchCategoryId &&
    watchSleeveId;

  // Validar si hay al menos un color, una talla, y que el precio y stock estén completos
  // Además, validar que cada color tenga al menos una imagen de cada ángulo
  const isVariantsValid =
    colorConfigs.length > 0 &&
    colorConfigs.every((config) => {
      const hasFront = config.images.some((img) => img.angle === "front");
      const hasSide = config.images.some((img) => img.angle === "side");
      const hasBack = config.images.some((img) => img.angle === "back");

      return (
        config.sizes.length > 0 &&
        Object.values(config.prices).every((price) => price > 0) &&
        Object.values(config.stocks).every((stock) => stock > 0) &&
        hasFront &&
        hasSide &&
        hasBack // Requiere al menos una imagen de cada ángulo
      );
    });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const slideIn = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  // Cargar las variantes del producto al inicializar el formulario
  useEffect(() => {
    if (product) {
      console.log(product);
      const initialColorConfigs: ColorSizeConfig[] = product.variants.reduce(
        (acc, variant) => {
          const existingConfig = acc.find(
            (config) => config.colorId === variant.colorId
          );

          if (existingConfig) {
            existingConfig.sizes.push(variant.sizeId);
            existingConfig.prices[variant.sizeId] = variant.price;
            existingConfig.stocks[variant.sizeId] = variant.stock;
            existingConfig.variantIds[variant.sizeId] = variant.id;
          } else {
            // Convertir las imágenes existentes y asignar ángulos por defecto
            let images: ExtendedImage[] = [];

            if (variant.images && variant.images.length > 0) {
              images = variant.images.map((img, index) => ({
                ...img,
                angle: (index === 0
                  ? "front"
                  : index === 1
                  ? "side"
                  : "back") as ImageAngle,
                isNew: false, // Imágenes existentes no son nuevas
              }));
            }

            // Si no hay suficientes imágenes, agregar placeholders
            const angles: ImageAngle[] = ["front", "side", "back"];
            angles.forEach((angle) => {
              if (!images.some((img) => img.angle === angle)) {
                images.push({
                  id: 0,
                  productVariantId: variant.id,
                  url: "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg",
                  angle: angle,
                  isNew: false,
                });
              }
            });

            acc.push({
              colorId: variant.colorId,
              sizes: [variant.sizeId],
              prices: { [variant.sizeId]: variant.price },
              stocks: { [variant.sizeId]: variant.stock },
              variantIds: { [variant.sizeId]: variant.id },
              images: images,
            });
          }
          return acc;
        },
        [] as ColorSizeConfig[]
      );

      setColorConfigs(initialColorConfigs);
    }
  }, [product]);

  // Cargar datos iniciales (colores, tallas, etc.)
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getSizes();
        const brandsData = await getBrands();
        const genderData = await getGenders();
        const categoryData = await getCategories();
        const sleeveData = await getSleeve();
        const colorsData = await getColors();

        if (brandsData) setBrands(brandsData.data);
        if (genderData) setGenders(genderData.data);
        if (categoryData) setCategory(categoryData.data);
        if (sleeveData) setNeckType(sleeveData.data);
        if (colorsData) setColors(colorsData.data);
        if (res) setSizes(res.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    getData();
  }, []);

  const handleAddColor = (colorId: string) => {
    const numericColorId = Number.parseInt(colorId, 10);
    if (!colorConfigs.some((config) => config.colorId === numericColorId)) {
      // Crear imágenes placeholder para cada ángulo
      const defaultImages: ExtendedImage[] = [
        {
          id: 0,
          productVariantId: 0,
          url: "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg",
          angle: "front",
          isNew: false,
        },
        {
          id: 0,
          productVariantId: 0,
          url: "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg",
          angle: "side",
          isNew: false,
        },
        {
          id: 0,
          productVariantId: 0,
          url: "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg",
          angle: "back",
          isNew: false,
        },
      ];

      setColorConfigs((prev) => [
        ...prev,
        {
          colorId: numericColorId,
          sizes: [],
          prices: {},
          stocks: {},
          variantIds: {},
          images: defaultImages,
        },
      ]);
      setSelectedColorId(numericColorId);
    }
  };

  const handleRemoveColor = async (colorId: number) => {
    const config = colorConfigs.find((c) => c.colorId === colorId);
    if (config) {
      // Eliminar imágenes nuevas de Cloudinary
      for (const image of config.images) {
        if (
          image.isNew &&
          image.url !==
            "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg"
        ) {
          await deleteImageFromCloudinary(image.url);
        }
      }
    }

    setColorConfigs((prev) =>
      prev.filter((config) => config.colorId !== colorId)
    );
    if (selectedColorId === colorId) {
      setSelectedColorId(null);
    }
  };

  const handleAddSize = (colorId: number, sizeId: string) => {
    const numericSizeId = Number.parseInt(sizeId, 10);
    setColorConfigs((prev) =>
      prev.map((config) =>
        config.colorId === colorId
          ? {
              ...config,
              sizes: [...config.sizes, numericSizeId],
              prices: { ...config.prices, [numericSizeId]: 0 },
              stocks: { ...config.stocks, [numericSizeId]: 0 },
            }
          : config
      )
    );
  };

  const handleRemoveSize = (colorId: number, sizeId: number) => {
    setColorConfigs((prev) =>
      prev.map((config) => {
        if (config.colorId === colorId) {
          const { [sizeId]: _, ...remainingPrices } = config.prices;
          const { [sizeId]: __, ...remainingStocks } = config.stocks;
          const { [sizeId]: ___, ...remainingVariantIds } = config.variantIds;
          return {
            ...config,
            sizes: config.sizes.filter((id) => id !== sizeId),
            prices: remainingPrices,
            stocks: remainingStocks,
            variantIds: remainingVariantIds,
          };
        }
        return config;
      })
    );
  };

  const handlePriceChange = (
    colorId: number,
    sizeId: number,
    price: string
  ) => {
    setColorConfigs((prev) =>
      prev.map((config) =>
        config.colorId === colorId
          ? {
              ...config,
              prices: { ...config.prices, [sizeId]: Number(price) || 0 },
            }
          : config
      )
    );
  };

  const handleStockChange = (
    colorId: number,
    sizeId: number,
    stock: string
  ) => {
    setColorConfigs((prev) =>
      prev.map((config) =>
        config.colorId === colorId
          ? {
              ...config,
              stocks: { ...config.stocks, [sizeId]: Number(stock) || 0 },
            }
          : config
      )
    );
  };

  const uploadImageToCloudinary = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dhhv8l6ti");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhhv8l6ti/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setIsUploading(false);
      return data.secure_url;
    } catch (error) {
      console.log(error);
      setIsUploading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo subir la imagen, intenta nuevamente.",
        confirmButtonColor: "#2F93D1",
      });
      return null;
    }
  };

  const deleteImageFromCloudinary = async (imageUrl: string) => {
    try {
      // Extraer el public_id de la URL de Cloudinary
      const urlParts = imageUrl.split("/");
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      const formData = new FormData();
      formData.append("public_id", publicId);
      formData.append("api_key", "your_api_key"); // Necesitarás configurar esto
      formData.append(
        "timestamp",
        Math.round(new Date().getTime() / 1000).toString()
      );

      // Nota: Para eliminar imágenes de Cloudinary necesitas hacer la llamada desde el backend
      // por seguridad, ya que requiere tu API secret
      console.log(`Imagen marcada para eliminación: ${publicId}`);

      // Aquí deberías hacer una llamada a tu backend para eliminar la imagen
      // await fetch('/api/delete-cloudinary-image', {
      //   method: 'POST',
      //   body: JSON.stringify({ publicId }),
      //   headers: { 'Content-Type': 'application/json' }
      // })
    } catch (error) {
      console.error("Error al eliminar imagen de Cloudinary:", error);
    }
  };

  const handleImageUpload = async (
    colorId: number,
    angle: ImageAngle,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2 MB
    const validTypes = ["image/png", "image/jpeg"];

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Error en el envío.",
        text: "La imagen debe ser de 2 MB o menos.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    }

    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no válido",
        text: "La imagen debe ser en formato PNG o JPEG.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    }

    setUploadingAngle(angle);
    const imageUrl = await uploadImageToCloudinary(file);

    if (imageUrl) {
      setColorConfigs((prev) =>
        prev.map((config) => {
          if (config.colorId === colorId) {
            const existingImageIndex = config.images.findIndex(
              (img) => img.angle === angle
            );
            const newImages = [...config.images];

            // Si existe una imagen para este ángulo y es nueva, eliminarla de Cloudinary
            if (existingImageIndex >= 0) {
              const existingImage = newImages[existingImageIndex];
              if (
                existingImage.isNew &&
                existingImage.url !==
                  "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg"
              ) {
                deleteImageFromCloudinary(existingImage.url);
              }

              // Actualizar imagen existente
              newImages[existingImageIndex] = {
                id: 0,
                productVariantId: 0,
                url: imageUrl,
                angle: angle,
                isNew: true,
              };
            } else {
              // Agregar nueva imagen
              newImages.push({
                id: 0,
                productVariantId: 0,
                url: imageUrl,
                angle: angle,
                isNew: true,
              });
            }

            return { ...config, images: newImages };
          }
          return config;
        })
      );
    }
    setUploadingAngle(null);
  };

  // Función para obtener la imagen de un ángulo específico
  const getImageForAngle = (colorId: number, angle: ImageAngle): string => {
    const config = colorConfigs.find((c) => c.colorId === colorId);
    if (!config)
      return "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg";

    const image = config.images.find((img) => img.angle === angle);
    return (
      image?.url ||
      "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg"
    );
  };

  // Función para verificar si una imagen es placeholder
  const isPlaceholderImage = (url: string): boolean => {
    return (
      url ===
      "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg"
    );
  };

  // Función para obtener la imagen principal (frontal o la primera disponible)
  const getMainImage = (colorId: number): string => {
    const config = colorConfigs.find((c) => c.colorId === colorId);
    if (!config || config.images.length === 0) {
      return "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg";
    }

    const frontImage = config.images.find((img) => img.angle === "front");
    return frontImage?.url || config.images[0].url;
  };

  const onSubmitForm = async (data: CreateProductDto) => {
    if (!isVariantsValid) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Debe agregar al menos un color, una talla, y una imagen para cada ángulo (frontal, lateral y posterior). También complete el precio y stock (stock debe ser mayor a 0).",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setIsLoading(true);

    try {
      const variants: ProductVariantDto[] = [];
      colorConfigs.forEach((config) => {
        config.sizes.forEach((sizeId) => {
          const colorName =
            colors?.find((c) => c.id === config.colorId)?.name || "unknown";
          const sizeName =
            sizes?.find((s) => s.id === sizeId)?.name || "unknown";

          // Crear la variante con las imágenes (sin el campo angle para el backend)
          const variant: ProductVariantDto = {
            colorId: config.colorId,
            sizeId,
            price: config.prices[sizeId] || 0,
            stock: config.stocks[sizeId] || 0,
            barcode: `${data.name.replace(/\s+/g, "-")}-${colorName.replace(
              /\s+/g,
              "-"
            )}-${sizeName.replace(/\s+/g, "-")}`.toUpperCase(),
            images: config.images
              .filter((img) => !isPlaceholderImage(img.url)) // Filtrar placeholders
              .map((img) => ({
                id: img.id,
                productVariantId: img.productVariantId,
                url: img.url,
                angle:img.angle
              })),
          };

          // Si existe un ID para esta variante, añadirlo
          if (config.variantIds && config.variantIds[sizeId]) {
            (variant as any).id = config.variantIds[sizeId];
          }

          variants.push(variant);
        });
      });

      const payload: CreateProductDto = {
        ...data,
        variants,
        genderId: +data.genderId,
        brandId: +data.brandId,
        sleeveId: +data.sleeveId,
        categoryId: +data.categoryId,
      };
      const response = product
        ? await updateProduct(payload, product.id)
        : await createProduct(payload);

      // Manejar la respuesta
      if (response) {
        reset();
        product ? await onEdit(response.data) : await onAdd(response.data);
        setIsLoading(false);

        Swal.fire({
          icon: "success",
          title: `¡Producto ${product ? "actualizado" : "agregado"}!`,
          text: `El producto se ha ${
            product ? "actualizado" : "agregado"
          } correctamente.`,
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          `Ha ocurrido un error al ${
            product ? "actualizar" : "agregar"
          } el producto`,
        confirmButtonColor: "#3B82F6",
      });
    }
  };

  // Pagination logic for variants table
  const totalPages = selectedColorId
    ? Math.ceil(
        (colorConfigs.find((c) => c.colorId === selectedColorId)?.sizes
          .length || 0) / itemsPerPage
      )
    : 0;

  // Función para avanzar al siguiente paso
  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();

    if (formStep === 0 && !isBasicInfoComplete) {
      Swal.fire({
        icon: "warning",
        title: "Información incompleta",
        text: "Por favor complete todos los campos obligatorios antes de continuar.",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setFormStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para retroceder al paso anterior
  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Obtener el nombre del color seleccionado
  const getSelectedColorName = () => {
    if (!selectedColorId || !colors) return "";
    return colors.find((c) => c.id === selectedColorId)?.name || "";
  };

  // Definir los ángulos disponibles con sus etiquetas
  const imageAngles: {
    angle: ImageAngle;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      angle: "front",
      label: "Frontal",
      icon: <Camera className="w-4 h-4" />,
      description: "Vista frontal del producto",
    },
    {
      angle: "side",
      label: "Lateral",
      icon: <Eye className="w-4 h-4" />,
      description: "Vista lateral del producto",
    },
    {
      angle: "back",
      label: "Posterior",
      icon: <Package className="w-4 h-4" />,
      description: "Vista posterior del producto",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado con estilo similar al ProductList */}
      <div className="bg-blue-500 dark:bg-blue-600 rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <Package2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {product ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <p className="mt-1 text-white/80 flex items-center">
                  <Package className="w-3.5 h-3.5 mr-1.5 inline" />
                  Complete la información del producto paso a paso
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onCancel}
              className="bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </motion.button>
          </div>
        </div>
      </div>

      {/* Indicador de progreso */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Progreso
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Paso {formStep + 1} de 3
          </span>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((formStep + 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 px-2">
            <div
              className={`flex flex-col items-center ${
                formStep >= 0
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
                  formStep >= 0
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                {formStep > 0 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span>Información</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                formStep >= 1
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
                  formStep >= 1
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                {formStep > 1 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span>Colores</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                formStep >= 2
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : ""
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 ${
                  formStep >= 2
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                {formStep > 2 ? <Check className="w-4 h-4" /> : "3"}
              </div>
              <span>Variantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del formulario */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Paso 1: Información básica del producto */}
          {formStep === 0 && (
            <motion.div
              className="space-y-6"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center mb-4">
                <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Información Básica del Producto
                </h3>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3 mb-6">
                <HelpCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Complete la información básica del producto. Todos los
                    campos son obligatorios.
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                {/* Nombre y descripción */}
                <div className="grid gap-6 md:grid-cols-1">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Tag className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      Nombre del producto
                    </label>
                    <input
                      id="name"
                      {...register("name", {
                        required: "El nombre es obligatorio",
                      })}
                      className="w-full rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      placeholder="Ej: Camiseta Deportiva Premium"
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-1">
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Info className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      {...register("description", {
                        required: "La descripción es obligatoria",
                      })}
                      className="w-full rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                      placeholder="Describa las características principales del producto"
                      rows={4}
                    />
                    {errors.description && (
                      <span className="text-sm text-red-500 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.description.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Categoría y marca */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="categoryId"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Tag className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      Categoría
                    </label>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{ required: "La categoría es obligatoria" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Seleccionar categoría</option>
                          {category &&
                            category.map((category) => (
                              <option
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </option>
                            ))}
                        </select>
                      )}
                    />
                    {errors.categoryId && (
                      <span className="text-sm text-red-500 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.categoryId.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="brandId"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      Marca
                    </label>
                    <Controller
                      name="brandId"
                      control={control}
                      rules={{ required: "La marca es obligatoria" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Seleccionar marca</option>
                          {brands &&
                            brands.map((brand) => (
                              <option
                                key={brand.id}
                                value={brand.id.toString()}
                              >
                                {brand.name}
                              </option>
                            ))}
                        </select>
                      )}
                    />
                    {errors.brandId && (
                      <span className="text-sm text-red-500 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.brandId.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Género y tipo de cuello */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="genderId"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Palette className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      Género
                    </label>
                    <Controller
                      name="genderId"
                      control={control}
                      rules={{ required: "El género es obligatorio" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Seleccionar género</option>
                          {genders &&
                            genders.map((gender) => (
                              <option
                                key={gender.id}
                                value={gender.id.toString()}
                              >
                                {gender.name}
                              </option>
                            ))}
                        </select>
                      )}
                    />
                    {errors.genderId && (
                      <span className="text-sm text-red-500 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.genderId.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="sleeveId"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Ruler className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                      Tipo de Cuello
                    </label>
                    <Controller
                      name="sleeveId"
                      control={control}
                      rules={{
                        required: "El tipo de cuello es obligatorio",
                      }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                        >
                          <option value="">Seleccionar tipo de cuello</option>
                          {neckType &&
                            neckType.map((sleeve) => (
                              <option
                                key={sleeve.id}
                                value={sleeve.id.toString()}
                              >
                                {sleeve.name}
                              </option>
                            ))}
                        </select>
                      )}
                    />
                    {errors.sleeveId && (
                      <span className="text-sm text-red-500 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.sleeveId.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Estado del producto */}
                <div className="pt-4">
                  <div className="flex items-center">
                    <Controller
                      name="active"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <div
                              className={`block w-14 h-8 rounded-full ${
                                field.value
                                  ? "bg-green-500"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            ></div>
                            <div
                              className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                                field.value ? "transform translate-x-6" : ""
                              }`}
                            ></div>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {field.value
                              ? "Producto Activo"
                              : "Producto Inactivo"}
                          </span>
                        </label>
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Paso 2: Selección de colores e imágenes */}
          {formStep === 1 && (
            <motion.div
              className="space-y-6"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center mb-4">
                <Palette className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Selección de Colores e Imágenes
                </h3>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3 mb-6">
                <HelpCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Seleccione los colores disponibles para este producto y suba
                    imágenes para cada ángulo (frontal, lateral y posterior).{" "}
                    <strong>
                      Es obligatorio subir al menos una imagen de cada ángulo.
                    </strong>
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Selector de colores */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                    <div className="flex-1">
                      <label
                        htmlFor="color"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
                      >
                        Agregar Color
                      </label>
                      <select
                        id="color"
                        onChange={(e) => handleAddColor(e.target.value)}
                        className="w-full rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                        value=""
                      >
                        <option value="">Seleccionar color</option>
                        {colors &&
                          colors
                            .filter(
                              (color) =>
                                !colorConfigs.some(
                                  (config) => config.colorId === color.id
                                )
                            )
                            .map((color) => (
                              <option
                                key={color.id}
                                value={color.id.toString()}
                              >
                                {color.name}
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>

                  {/* Lista de colores seleccionados */}
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Colores seleccionados
                  </h4>

                  <div className="grid grid-cols-1 gap-6">
                    {colorConfigs.length === 0 && (
                      <div className="col-span-full text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                        No hay colores seleccionados. Seleccione al menos un
                        color.
                      </div>
                    )}

                    <AnimatePresence>
                      {colorConfigs.map((config) => {
                        const color = colors?.find(
                          (c) => c.id === config.colorId
                        );
                        const hasFront = config.images.some(
                          (img) =>
                            img.angle === "front" &&
                            !isPlaceholderImage(img.url)
                        );
                        const hasSide = config.images.some(
                          (img) =>
                            img.angle === "side" && !isPlaceholderImage(img.url)
                        );
                        const hasBack = config.images.some(
                          (img) =>
                            img.angle === "back" && !isPlaceholderImage(img.url)
                        );
                        const isComplete = hasFront && hasSide && hasBack;

                        return (
                          <motion.div
                            key={config.colorId}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`bg-white dark:bg-gray-800 rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all ${
                              isComplete
                                ? "border-green-200 dark:border-green-700"
                                : "border-red-200 dark:border-red-700"
                            }`}
                          >
                            {/* Header del color */}
                            <div
                              className={`p-4 border-b ${
                                isComplete
                                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div
                                    className="w-6 h-6 rounded-full mr-3 border-2 border-white dark:border-gray-600 shadow-sm"
                                    style={{
                                      backgroundColor:
                                        color?.hexValue || "#ccc",
                                    }}
                                  ></div>
                                  <h5 className="font-semibold text-gray-900 dark:text-white">
                                    {color?.name}
                                  </h5>
                                  {isComplete ? (
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 ml-2" />
                                  ) : (
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-2" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      isComplete
                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                    }`}
                                  >
                                    {isComplete ? "Completo" : "Incompleto"}
                                  </span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() =>
                                      handleRemoveColor(config.colorId)
                                    }
                                    className="p-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 rounded-full shadow-sm"
                                  >
                                    <X className="h-4 w-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>

                            {/* Grid de imágenes por ángulo */}
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {imageAngles.map(
                                  ({ angle, label, icon, description }) => {
                                    const hasImage = config.images.some(
                                      (img) =>
                                        img.angle === angle &&
                                        !isPlaceholderImage(img.url)
                                    );

                                    return (
                                      <div key={angle} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div
                                            className={`flex items-center text-sm font-medium ${
                                              hasImage
                                                ? "text-green-700 dark:text-green-400"
                                                : "text-red-700 dark:text-red-400"
                                            }`}
                                          >
                                            {icon}
                                            <span className="ml-2">
                                              {label}
                                            </span>
                                            {hasImage ? (
                                              <Check className="w-4 h-4 ml-1" />
                                            ) : (
                                              <AlertCircle className="w-4 h-4 ml-1" />
                                            )}
                                          </div>
                                        </div>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {description}
                                        </p>

                                        {/* Imagen actual */}
                                        <div
                                          className={`relative aspect-square rounded-lg overflow-hidden group border-2 ${
                                            hasImage
                                              ? "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10"
                                              : "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
                                          }`}
                                        >
                                          <img
                                            src={
                                              getImageForAngle(
                                                config.colorId,
                                                angle
                                              ) || "/placeholder.svg"
                                            }
                                            alt={`${color?.name} - ${label}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                          />

                                          {/* Overlay con botón de carga */}
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <motion.label
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                              htmlFor={`image-upload-${config.colorId}-${angle}`}
                                              className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg cursor-pointer flex items-center text-sm font-medium transition-colors hover:bg-white dark:hover:bg-gray-800"
                                            >
                                              {isUploading &&
                                              uploadingAngle === angle ? (
                                                <>
                                                  <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <circle
                                                      className="opacity-25"
                                                      cx="12"
                                                      cy="12"
                                                      r="10"
                                                      stroke="currentColor"
                                                      strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                      className="opacity-75"
                                                      fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                  </svg>
                                                  Subiendo...
                                                </>
                                              ) : (
                                                <>
                                                  <Upload className="w-4 h-4 mr-2" />
                                                  {hasImage
                                                    ? "Cambiar"
                                                    : "Subir"}
                                                </>
                                              )}
                                            </motion.label>
                                          </div>

                                          {/* Indicador de estado */}
                                          <div
                                            className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                                              hasImage
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                            }`}
                                          ></div>
                                        </div>

                                        {/* Input de archivo oculto */}
                                        <input
                                          id={`image-upload-${config.colorId}-${angle}`}
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            handleImageUpload(
                                              config.colorId,
                                              angle,
                                              e
                                            )
                                          }
                                          disabled={isUploading}
                                        />
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Paso 3: Configuración de tallas, precios y stock */}
          {formStep === 2 && (
            <motion.div
              className="space-y-6"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center mb-4">
                <Layers className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Configuración de Variantes
                </h3>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3 mb-6">
                <HelpCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p>
                    Configure las tallas, precios y stock para cada color
                    seleccionado.
                  </p>
                </div>
              </div>

              {colorConfigs.length === 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    No hay colores seleccionados
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Debe seleccionar al menos un color antes de configurar las
                    variantes.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a selección de colores
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Selector de color para configurar */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
                      Seleccione un color para configurar sus variantes
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {colorConfigs.map((config) => {
                        const color = colors?.find(
                          (c) => c.id === config.colorId
                        );
                        const hasFront = config.images.some(
                          (img) =>
                            img.angle === "front" &&
                            !isPlaceholderImage(img.url)
                        );
                        const hasSide = config.images.some(
                          (img) =>
                            img.angle === "side" && !isPlaceholderImage(img.url)
                        );
                        const hasBack = config.images.some(
                          (img) =>
                            img.angle === "back" && !isPlaceholderImage(img.url)
                        );
                        const isComplete = hasFront && hasSide && hasBack;

                        return (
                          <motion.button
                            key={config.colorId}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setSelectedColorId(config.colorId)}
                            className={`p-3 rounded-lg flex flex-col items-center transition-all ${
                              selectedColorId === config.colorId
                                ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400"
                                : isComplete
                                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30"
                                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                            }`}
                          >
                            <div className="relative mb-2">
                              <img
                                src={
                                  getMainImage(config.colorId) 
                                }
                                alt={color?.name}
                                className="w-12 h-12 rounded-lg object-cover border-2 border-white dark:border-gray-600 shadow-sm"
                              />
                              <div
                                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-600"
                                style={{
                                  backgroundColor: color?.hexValue || "#ccc",
                                }}
                              ></div>
                              {isComplete ? (
                                <Check className="absolute -top-1 -left-1 w-4 h-4 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 rounded-full" />
                              ) : (
                                <AlertCircle className="absolute -top-1 -left-1 w-4 h-4 text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 rounded-full" />
                              )}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                selectedColorId === config.colorId
                                  ? "text-blue-700 dark:text-blue-400"
                                  : isComplete
                                  ? "text-green-700 dark:text-green-400"
                                  : "text-red-700 dark:text-red-400"
                              }`}
                            >
                              {color?.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {config.sizes.length} tallas
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Configuración de tallas para el color seleccionado */}
                  {selectedColorId ? (
                    <motion.div
                      variants={slideIn}
                      initial="hidden"
                      animate="visible"
                      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <img
                            src={
                              getMainImage(selectedColorId) 
                            }
                            alt={getSelectedColorName()}
                            className="w-8 h-8 rounded-lg object-cover mr-3 border-2 border-white dark:border-gray-600 shadow-sm"
                          />
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Configuración para {getSelectedColorName()}
                          </h4>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <ImageIcon className="w-4 h-4 mr-1" />
                          {colorConfigs
                            .find((c) => c.colorId === selectedColorId)
                            ?.images.filter(
                              (img) => !isPlaceholderImage(img.url)
                            ).length || 0}{" "}
                          imágenes reales
                        </div>
                      </div>

                      {/* Selector de tallas */}
                      <div className="mb-6">
                        <label
                          htmlFor="size"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2"
                        >
                          <Ruler className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          Agregar Talla
                        </label>
                        <div className="flex gap-2">
                          <select
                            id="size"
                            onChange={(e) =>
                              handleAddSize(selectedColorId, e.target.value)
                            }
                            className="flex-1 rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                            value=""
                          >
                            <option value="">Seleccionar talla</option>
                            {sizes &&
                              sizes
                                .filter(
                                  (size) =>
                                    !colorConfigs
                                      .find(
                                        (config) =>
                                          config.colorId === selectedColorId
                                      )
                                      ?.sizes.includes(size.id)
                                )
                                .map((size) => (
                                  <option
                                    key={size.id}
                                    value={size.id.toString()}
                                  >
                                    {size.name}
                                  </option>
                                ))}
                          </select>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors shadow-md"
                            onClick={() => {
                              const select = document.getElementById(
                                "size"
                              ) as HTMLSelectElement;
                              if (select.value) {
                                handleAddSize(selectedColorId, select.value);
                                select.value = "";
                              }
                            }}
                          >
                            <Plus className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Tallas seleccionadas */}
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Tallas seleccionadas
                        </h5>

                        {colorConfigs.find((c) => c.colorId === selectedColorId)
                          ?.sizes.length === 0 ? (
                          <div className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
                            No hay tallas seleccionadas. Seleccione al menos una
                            talla.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                              {colorConfigs
                                .find((c) => c.colorId === selectedColorId)
                                ?.sizes.map((sizeId) => {
                                  const size = sizes?.find(
                                    (s) => s.id === sizeId
                                  );
                                  return (
                                    <motion.div
                                      key={sizeId}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      whileHover={{ scale: 1.05 }}
                                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow-md transition-all"
                                    >
                                      {size?.name}
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() =>
                                          handleRemoveSize(
                                            selectedColorId,
                                            sizeId
                                          )
                                        }
                                        className="ml-2 p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400"
                                      >
                                        <X className="h-3 w-3" />
                                      </motion.button>
                                    </motion.div>
                                  );
                                })}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Tabla de precios y stock */}
                      {(colorConfigs.find((c) => c.colorId === selectedColorId)
                        ?.sizes.length || 0) > 0 && (
                        <div>
                          <h5 className="text-base font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                            Precios y Stock
                          </h5>

                          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
                            {/* Encabezado de tabla */}
                            <div className="bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-4 px-6">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3 font-medium">
                                  Talla
                                </div>
                                <div className="col-span-4 font-medium">
                                  Precio
                                </div>
                                <div className="col-span-4 font-medium">
                                  Stock
                                </div>
                                <div className="col-span-1 font-medium text-right">
                                  Acciones
                                </div>
                              </div>
                            </div>

                            {/* Filas de variantes */}
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                              <AnimatePresence>
                                {colorConfigs
                                  .find(
                                    (config) =>
                                      config.colorId === selectedColorId
                                  )
                                  ?.sizes.slice(
                                    (currentPage - 1) * itemsPerPage,
                                    currentPage * itemsPerPage
                                  )
                                  .map((sizeId, index) => (
                                    <motion.div
                                      key={sizeId}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className={`px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors ${
                                        index % 2 === 0
                                          ? "bg-white dark:bg-gray-800"
                                          : "bg-gray-50/50 dark:bg-gray-800/50"
                                      }`}
                                    >
                                      <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-3 font-medium text-gray-900 dark:text-white">
                                          {
                                            sizes?.find((s) => s.id === sizeId)
                                              ?.name
                                          }
                                        </div>
                                        <div className="col-span-4">
                                          <div className="relative">
                                            <DollarSign className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                            <input
                                              type="number"
                                              value={
                                                colorConfigs.find(
                                                  (c) =>
                                                    c.colorId ===
                                                    selectedColorId
                                                )?.prices[sizeId] || ""
                                              }
                                              onChange={(e) =>
                                                handlePriceChange(
                                                  selectedColorId,
                                                  sizeId,
                                                  e.target.value
                                                )
                                              }
                                              className="w-full pl-12 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                              placeholder="0.00"
                                              step="0.01"
                                              min="0"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-span-4">
                                          <input
                                            type="number"
                                            value={
                                              colorConfigs.find(
                                                (c) =>
                                                  c.colorId === selectedColorId
                                              )?.stocks[sizeId] || ""
                                            }
                                            onChange={(e) =>
                                              handleStockChange(
                                                selectedColorId,
                                                sizeId,
                                                e.target.value
                                              )
                                            }
                                            className="w-full py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                            placeholder="0"
                                            min="1"
                                          />
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                          <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() =>
                                              handleRemoveSize(
                                                selectedColorId,
                                                sizeId
                                              )
                                            }
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 rounded-full"
                                          >
                                            <X className="h-4 w-4" />
                                          </motion.button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                              </AnimatePresence>
                            </div>

                            {/* Paginación */}
                            {(colorConfigs.find(
                              (c) => c.colorId === selectedColorId
                            )?.sizes.length ?? 0) > itemsPerPage && (
                              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Mostrar
                                  </span>
                                  <select
                                    className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                      setItemsPerPage(Number(e.target.value));
                                      setCurrentPage(1);
                                    }}
                                  >
                                    <option value={3}>3</option>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                  </select>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    por página
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={currentPage === 1}
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>

                                  <div className="flex items-center">
                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium">
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
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={
                                      currentPage === totalPages ||
                                      totalPages === 0
                                    }
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                      )
                                    }
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center shadow-sm"
                    >
                      <Palette className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                        Seleccione un color
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Haga clic en uno de los colores de arriba para
                        configurar sus tallas, precios y stock.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            {formStep > 0 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={(e) => prevStep(e)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancelar
              </motion.button>
            )}

            {formStep < 2 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={(e) => nextStep(e)}
                className={`px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center transition-colors shadow-md ${
                  formStep === 0 && !isBasicInfoComplete
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={formStep === 0 && !isBasicInfoComplete}
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || !isBasicInfoComplete || !isVariantsValid}
                className={`px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg font-medium flex items-center transition-colors shadow-md ${
                  isLoading || !isBasicInfoComplete || !isVariantsValid
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>{product ? "Actualizar Producto" : "Guardar Producto"}</>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
