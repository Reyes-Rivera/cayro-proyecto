/* eslint-disable no-constant-binary-expression */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useState, useEffect } from "react";
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
} from "../data/sampleData";
import {
  Package,
  Info,
  Palette,
  Tag,
  Upload,
  Plus,
  X,
  Check,
  ArrowLeft,
  ShoppingBag,
  Ruler,
  DollarSign,
  Layers,
  ImageIcon,
  AlertCircle,
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

interface ColorSizeConfig {
  colorId: number;
  sizes: number[];
  prices: { [key: number]: number };
  stocks: { [key: number]: number };
  image: string;
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

  const [colorConfigs, setColorConfigs] = useState<ColorSizeConfig[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "variants">("info");
  const [sizes, setSizes] = useState<Size[]>();
  const [brands, setBrands] = useState<Brand[]>();
  const [genders, setGenders] = useState<Gender[]>();
  const [category, setCategory] = useState<Category[]>();
  const [neckType, setNeckType] = useState<NeckType[]>();
  const [colors, setColors] = useState<Color[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Estado para controlar la subida de imágenes

  const watchName = watch("name");
  const watchDescription = watch("description");
  const watchBrandId = watch("brandId");
  const watchGenderId = watch("genderId");
  const watchCategoryId = watch("categoryId");
  const watchSleeveId = watch("sleeveId");

  // Validar si la pestaña de información básica está completa
  const isBasicInfoComplete =
    watchName &&
    watchDescription &&
    watchBrandId &&
    watchGenderId &&
    watchCategoryId &&
    watchSleeveId;

  // Validar si hay al menos un color, una talla, y que el precio y stock estén completos
  const isVariantsValid =
    colorConfigs.length > 0 &&
    colorConfigs.every(
      (config) =>
        config.sizes.length > 0 &&
        Object.values(config.prices).every((price) => price > 0) &&
        Object.values(config.stocks).every((stock) => stock > 0)
    );

  // Cargar las variantes del producto al inicializar el formulario
  useEffect(() => {
    if (product) {
      const initialColorConfigs: ColorSizeConfig[] = product.variants.reduce(
        (acc, variant) => {
          const existingConfig = acc.find(
            (config) => config.colorId === variant.colorId
          );

          if (existingConfig) {
            existingConfig.sizes.push(variant.sizeId);
            existingConfig.prices[variant.sizeId] = variant.price;
            existingConfig.stocks[variant.sizeId] = variant.stock;
          } else {
            acc.push({
              colorId: variant.colorId,
              sizes: [variant.sizeId],
              prices: { [variant.sizeId]: variant.price },
              stocks: { [variant.sizeId]: variant.stock },
              image:
                variant.imageUrl ||
                "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg",
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
      setColorConfigs((prev) => [
        ...prev,
        {
          colorId: numericColorId,
          sizes: [],
          prices: {},
          stocks: {},
          image:
            "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg",
        },
      ]);
      setSelectedColorId(numericColorId);
    }
  };

  const handleRemoveColor = (colorId: number) => {
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
          return {
            ...config,
            sizes: config.sizes.filter((id) => id !== sizeId),
            prices: remainingPrices,
            stocks: remainingStocks,
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
    setIsUploading(true); // Activar el estado de carga
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Reemplaza con tu upload preset
    formData.append("cloud_name", "dhhv8l6ti"); // Reemplaza con tu cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhhv8l6ti/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setIsUploading(false); // Desactivar el estado de carga
      return data.secure_url;
    } catch (error) {
      console.log(error);
      setIsUploading(false); // Desactivar el estado de carga en caso de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo subir la imagen, intenta nuevamente.",
        confirmButtonColor: "#2F93D1",
      });
      return null;
    }
  };

  const handleImageUpload = async (
    colorId: number,
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

    const imageUrl = await uploadImageToCloudinary(file);
    if (imageUrl) {
      setColorConfigs((prev) =>
        prev.map((config) =>
          config.colorId === colorId ? { ...config, image: imageUrl } : config
        )
      );
    }
  };

  const onSubmitForm = async (data: CreateProductDto) => {
    if (!isVariantsValid) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Debe agregar al menos un color, una talla, y completar el precio y stock (stock debe ser mayor a 0).",
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

          variants.push({
            colorId: config.colorId,
            sizeId,
            price: config.prices[sizeId] || 0,
            stock: config.stocks[sizeId] || 0,
            barcode: `${data.name.replace(/\s+/g, "-")}-${colorName.replace(
              /\s+/g,
              "-"
            )}-${sizeName.replace(/\s+/g, "-")}`.toUpperCase(),

            imageUrl:
              config.image ||
              "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg",
          });
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
      // Llamada a la API para crear o actualizar el producto
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
  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Encabezado */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className=" bg-white p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center">
                  <Package className="w-6 h-6 mr-2" />
                  {product ? "Editar Producto" : "Agregar Nuevo Producto"}
                </h1>
                <p className="text-gray-600">
                  Complete la información del producto y configure sus variantes
                  por color y talla.
                </p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
            </div>
          </div>

          {/* Pestañas */}
          <div className="bg-white p-6">
            <div className="flex space-x-2 border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === "info"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Info
                  className={`w-4 h-4 mr-2 ${
                    activeTab === "info" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                Información Básica
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("variants")}
                disabled={!isBasicInfoComplete}
                className={`px-4 py-3 text-sm font-medium flex items-center ${
                  activeTab === "variants"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                } ${
                  !isBasicInfoComplete ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Layers
                  className={`w-4 h-4 mr-2 ${
                    activeTab === "variants" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                Variantes
                {colorConfigs.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {colorConfigs.length}
                  </span>
                )}
              </button>
            </div>

            {/* Contenido de las pestañas */}
            <div className="space-y-6">
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Alerta informativa */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-semibold">Información del Producto</p>
                      <p>
                        Complete la información básica del producto antes de
                        configurar las variantes. Todos los campos son
                        obligatorios.
                      </p>
                    </div>
                  </div>

                  {/* Campos del formulario */}
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <Tag className="w-4 h-4 mr-2 text-blue-500" />
                        Nombre del producto
                      </label>
                      <input
                        id="name"
                        {...register("name", {
                          required: "El nombre es obligatorio",
                        })}
                        className="w-full rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Ej: Camiseta Deportiva Premium"
                      />
                      {errors.name && (
                        <span className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <Info className="w-4 h-4 mr-2 text-blue-500" />
                        Descripción
                      </label>
                      <textarea
                        id="description"
                        {...register("description", {
                          required: "La descripción es obligatoria",
                        })}
                        className="w-full rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Describa las características principales del producto"
                        rows={4}
                      />
                      {errors.description && (
                        <span className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.description.message}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <label
                          htmlFor="brandId"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2 text-blue-500" />
                          Marca
                        </label>
                        <Controller
                          name="brandId"
                          control={control}
                          rules={{ required: "La marca es obligatoria" }}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                          <span className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.brandId.message}
                          </span>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <label
                          htmlFor="genderId"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <Palette className="w-4 h-4 mr-2 text-blue-500" />
                          Género
                        </label>
                        <Controller
                          name="genderId"
                          control={control}
                          rules={{ required: "El género es obligatorio" }}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                          <span className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.genderId.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid gap-3">
                        <label
                          htmlFor="categoryId"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <Tag className="w-4 h-4 mr-2 text-blue-500" />
                          Categoría
                        </label>
                        <Controller
                          name="categoryId"
                          control={control}
                          rules={{ required: "La categoría es obligatoria" }}
                          render={({ field }) => (
                            <select
                              {...field}
                              className="w-full rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                          <span className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.categoryId.message}
                          </span>
                        )}
                      </div>

                      <div className="grid gap-3">
                        <label
                          htmlFor="sleeveId"
                          className="text-sm font-medium text-gray-700 flex items-center"
                        >
                          <Ruler className="w-4 h-4 mr-2 text-blue-500" />
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
                              className="w-full rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                              <option value="">
                                Seleccionar tipo de cuello
                              </option>
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
                          <span className="text-sm text-red-500 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.sleeveId.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
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
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                                <div
                                  className={`block w-14 h-8 rounded-full ${
                                    field.value ? "bg-green-500" : "bg-gray-300"
                                  }`}
                                ></div>
                                <div
                                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                                    field.value ? "transform translate-x-6" : ""
                                  }`}
                                ></div>
                              </div>
                              <span className="ml-3 text-sm font-medium text-gray-700">
                                {field.value
                                  ? "Producto Activo"
                                  : "Producto Inactivo"}
                              </span>
                            </label>
                          )}
                        />
                      </div>

                      {isBasicInfoComplete && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab("variants");
                            window.scrollTo({
                              top: 0,
                              left: 0,
                              behavior: "smooth",
                            });
                          }}
                          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Continuar a Variantes
                          <svg
                            className="w-5 h-5 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "variants" && (
                <div className="space-y-6">
                  {/* Alerta informativa */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-semibold">
                        Configuración de Variantes
                      </p>
                      <ol className="list-decimal ml-4 mt-1 space-y-1">
                        <li>
                          Seleccione un color y suba una imagen para ese color
                        </li>
                        <li>Para cada color, agregue las tallas disponibles</li>
                        <li>
                          Configure el precio y el stock para cada combinación
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Configuración de colores y tallas */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Palette className="w-5 h-5 mr-2 text-blue-500" />
                        Selección de Colores
                      </h3>

                      <div className="flex gap-4 items-end mb-4">
                        <div className="flex-1">
                          <label
                            htmlFor="color"
                            className="text-sm font-medium text-gray-700 block mb-2"
                          >
                            Agregar Color
                          </label>
                          <select
                            id="color"
                            onChange={(e) => handleAddColor(e.target.value)}
                            className="w-full rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                      <div className="flex flex-wrap gap-2 mb-4">
                        {colorConfigs.length === 0 && (
                          <div className="text-sm text-gray-500 italic">
                            No hay colores seleccionados. Seleccione al menos un
                            color.
                          </div>
                        )}

                        {colorConfigs.map((config) => {
                          const color = colors?.find(
                            (c) => c.id === config.colorId
                          );
                          return (
                            <div
                              key={config.colorId}
                              className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center ${
                                selectedColorId === config.colorId
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                              onClick={() => setSelectedColorId(config.colorId)}
                            >
                              <div
                                className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                style={{
                                  backgroundColor: color?.hexValue || "#ccc",
                                }}
                              ></div>
                              {color?.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveColor(config.colorId);
                                }}
                                className={`ml-2 p-1 rounded-full ${
                                  selectedColorId === config.colorId
                                    ? "hover:bg-blue-700 text-blue-100"
                                    : "hover:bg-gray-300 text-gray-500"
                                }`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Configuración de tallas para el color seleccionado */}
                    {selectedColorId ? (
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <Palette className="w-5 h-5 mr-2 text-blue-500" />
                            Configuración para{" "}
                            <span className="ml-1 font-bold">
                              {
                                colors?.find((c) => c.id === selectedColorId)
                                  ?.name
                              }
                            </span>
                          </h3>

                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{
                                backgroundColor:
                                  colors?.find((c) => c.id === selectedColorId)
                                    ?.hexValue || "#ccc",
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Imagen del color */}
                          <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                              <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                              Imagen del producto
                            </label>

                            <div className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center">
                              <img
                                src={
                                  colorConfigs.find(
                                    (c) => c.colorId === selectedColorId
                                  )?.image ||
                                  "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg" ||
                                  "https://res.cloudinary.com/dhhv8l6ti/image/upload/v1741550306/a58jbqkjh7csdrlw3qfd.jpg"
                                }
                                alt={`Color ${
                                  colors?.find((c) => c.id === selectedColorId)
                                    ?.name
                                }`}
                                className="w-full max-w-[200px] h-auto object-contain rounded-md mb-3"
                              />

                              <label
                                htmlFor={`image-upload-${selectedColorId}`}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg cursor-pointer flex items-center transition-colors"
                              >
                                {isUploading ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
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
                                    Subir imagen
                                  </>
                                )}
                              </label>
                              <input
                                id={`image-upload-${selectedColorId}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleImageUpload(selectedColorId, e)
                                }
                                disabled={isUploading} // Deshabilitar el input durante la subida
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                Formatos: JPG, PNG. Tamaño máximo: 2MB
                              </p>
                            </div>
                          </div>

                          {/* Selección de tallas */}
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor="size"
                                className="text-sm font-medium text-gray-700 flex items-center"
                              >
                                <Ruler className="w-4 h-4 mr-2 text-blue-500" />
                                Agregar Talla
                              </label>
                              <div className="flex gap-2 mt-2">
                                <select
                                  id="size"
                                  onChange={(e) =>
                                    handleAddSize(
                                      selectedColorId,
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 rounded-lg p-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                                                config.colorId ===
                                                selectedColorId
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
                                <button
                                  type="button"
                                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                                  onClick={() => {
                                    const select = document.getElementById(
                                      "size"
                                    ) as HTMLSelectElement;
                                    if (select.value) {
                                      handleAddSize(
                                        selectedColorId,
                                        select.value
                                      );
                                      select.value = "";
                                    }
                                  }}
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Tallas seleccionadas */}
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Tallas seleccionadas
                              </h4>

                              {colorConfigs.find(
                                (c) => c.colorId === selectedColorId
                              )?.sizes.length === 0 && (
                                <div className="text-sm text-gray-500 italic">
                                  No hay tallas seleccionadas. Seleccione al
                                  menos una talla.
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                {colorConfigs
                                  .find((c) => c.colorId === selectedColorId)
                                  ?.sizes.map((sizeId) => {
                                    const size = sizes?.find(
                                      (s) => s.id === sizeId
                                    );
                                    return (
                                      <div
                                        key={sizeId}
                                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                                      >
                                        {size?.name}
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveSize(
                                              selectedColorId,
                                              sizeId
                                            )
                                          }
                                          className="ml-2 p-1 hover:bg-gray-300 rounded-full text-gray-500"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lista de tallas y precios */}
                        {(
                          colorConfigs.find(
                            (c) => c.colorId === selectedColorId
                          ) ?? { sizes: [] }
                        ).sizes.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                              Precios y Stock
                            </h4>

                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-medium text-gray-500">
                                <div className="col-span-3">Talla</div>
                                <div className="col-span-4">Precio</div>
                                <div className="col-span-4">Stock</div>
                                <div className="col-span-1"></div>
                              </div>

                              <div className="space-y-3">
                                {colorConfigs
                                  .find(
                                    (config) =>
                                      config.colorId === selectedColorId
                                  )
                                  ?.sizes.map((sizeId) => (
                                    <div
                                      key={sizeId}
                                      className="grid grid-cols-12 gap-4 items-center bg-white rounded-lg p-3 border border-gray-200"
                                    >
                                      <div className="col-span-3 font-medium">
                                        {
                                          sizes?.find((s) => s.id === sizeId)
                                            ?.name
                                        }
                                      </div>
                                      <div className="col-span-4">
                                        <div className="relative">
                                          <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                          <input
                                            type="number"
                                            value={
                                              colorConfigs.find(
                                                (c) =>
                                                  c.colorId === selectedColorId
                                              )?.prices[sizeId] || ""
                                            }
                                            onChange={(e) =>
                                              handlePriceChange(
                                                selectedColorId,
                                                sizeId,
                                                e.target.value
                                              )
                                            }
                                            className="w-full pl-9 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                                          className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                          placeholder="0"
                                          min="1"
                                        />
                                      </div>
                                      <div className="col-span-1 flex justify-center">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveSize(
                                              selectedColorId,
                                              sizeId
                                            )
                                          }
                                          className="p-1 hover:bg-red-100 text-red-500 rounded-full"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : colorConfigs.length > 0 ? (
                      <div className="bg-blue-50 rounded-lg p-6 text-center">
                        <Palette className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          Seleccione un color
                        </h3>
                        <p className="text-gray-600">
                          Haga clic en uno de los colores de arriba para
                          configurar sus tallas y precios.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          No hay colores seleccionados
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Seleccione al menos un color para comenzar a
                          configurar las variantes del producto.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen y validación */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                {activeTab === "variants" && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colorConfigs.length > 0
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="ml-2 text-sm text-gray-600">
                        Colores
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colorConfigs.some((config) => config.sizes.length > 0)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="ml-2 text-sm text-gray-600">Tallas</span>
                    </div>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isVariantsValid ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="ml-2 text-sm text-gray-600">
                        Precios y Stock
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    (activeTab === "variants" && !isVariantsValid) || isLoading
                  }
                  className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center ${
                    (activeTab === "variants" && !isVariantsValid) || isLoading
                      ? "opacity-70 cursor-not-allowed"
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
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {product ? "Actualizar" : "Crear"} Producto
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
