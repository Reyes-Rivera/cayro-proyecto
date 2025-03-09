/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  type Product,
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
  product?: Product;
  onSubmit: (product: CreateProductDto) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
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
      name: "",
      description: "",
      active: true,
      brandId: undefined,
      genderId: undefined,
      sleeveId: undefined,
      categoryId: undefined,
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
        Object.values(config.stocks).every((stock) => stock >= 0)
    );

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        active: product.active,
        brandId: product.brandId,
        genderId: product.genderId,
        sleeveId: product.sleeveId ?? undefined,
        categoryId: product.categoryId,
        variants: product.variants,
      });

      const configsByColor = product.variants.reduce(
        (acc: ColorSizeConfig[], variant) => {
          const existingConfig = acc.find(
            (config) => config.colorId === variant.colorId
          );
          if (existingConfig) {
            if (!existingConfig.sizes.includes(variant.sizeId)) {
              existingConfig.sizes.push(variant.sizeId);
            }
            existingConfig.prices[variant.sizeId] = variant.price;
            existingConfig.stocks[variant.sizeId] = variant.stock;
          } else {
            acc.push({
              colorId: variant.colorId,
              sizes: [variant.sizeId],
              prices: { [variant.sizeId]: variant.price },
              stocks: { [variant.sizeId]: variant.stock },
              image: variant.imageUrl || "/placeholder.svg?height=200&width=200",
            });
          }
          return acc;
        },
        []
      );

      setColorConfigs(configsByColor);
    }
  }, [product, reset]);

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
          image: "https://images.app.goo.gl/wDgQcLv2fc8ZHWaq6",
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

  const handlePriceChange = (colorId: number, sizeId: number, price: string) => {
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

  const handleStockChange = (colorId: number, sizeId: number, stock: string) => {
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

  const handleImageUpload = (
    colorId: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setColorConfigs((prev) =>
          prev.map((config) =>
            config.colorId === colorId
              ? {
                  ...config,
                  image: reader.result as string,
                }
              : config
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitForm = (data: CreateProductDto) => {
    if (!isVariantsValid) {
      alert("Debe agregar al menos un color, una talla, y completar el precio y stock.");
      return;
    }

    const variants: ProductVariantDto[] = [];

    colorConfigs.forEach((config) => {
      config.sizes.forEach((sizeId) => {
        const colorName =
          colors?.find((c) => c.id === config.colorId)?.name || "unknown";
        const sizeName = sizes?.find((s) => s.id === sizeId)?.name || "unknown";

        variants.push({
          colorId: config.colorId,
          sizeId,
          price: config.prices[sizeId] || 0,
          stock: config.stocks[sizeId] || 0,
          barcode: `${data.name}-${colorName}-${sizeName}`.toUpperCase(),
          imageUrl: config.image,
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
    console.log(payload);
    onSubmit(payload);
  };

  useEffect(() => {
    const getData = async () => {
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
    };
    getData();
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="max-w-6xl mx-auto p-4 space-y-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {product ? "Editar Producto" : "Agregar Nuevo Producto"}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Complete la información del producto y configure sus variantes por
            color y talla.
          </p>
        </div>

        {/* Pestañas */}
        <div className="space-y-4">
          <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "info"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Información Básica
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("variants")}
              disabled={!isBasicInfoComplete}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "variants"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              } ${
                !isBasicInfoComplete
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Variantes
            </button>
          </div>

          {/* Contenido de las pestañas */}
          <div className="space-y-4">
            {activeTab === "info" && (
              <div className="space-y-4">
                {/* Alerta */}
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400 dark:text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-200">
                    <p className="font-semibold">Información del Producto</p>
                    <p>
                      Complete la información básica del producto antes de
                      configurar las variantes.
                    </p>
                  </div>
                </div>

                {/* Campos del formulario */}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Nombre del producto
                    </label>
                    <input
                      id="name"
                      {...register("name", {
                        required: "El nombre es obligatorio",
                      })}
                      className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      placeholder="Nombre del producto"
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      {...register("description", {
                        required: "La descripción es obligatoria",
                      })}
                      className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      placeholder="Descripción del producto"
                      rows={4}
                    />
                    {errors.description && (
                      <span className="text-sm text-red-500">
                        {errors.description.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="brandId"
                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Marca
                      </label>
                      <Controller
                        name="brandId"
                        control={control}
                        rules={{ required: "La marca es obligatoria" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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
                        <span className="text-sm text-red-500">
                          {errors.brandId.message}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="genderId"
                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Género
                      </label>
                      <Controller
                        name="genderId"
                        control={control}
                        rules={{ required: "El género es obligatorio" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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
                        <span className="text-sm text-red-500">
                          {errors.genderId.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="categoryId"
                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Categoría
                      </label>
                      <Controller
                        name="categoryId"
                        control={control}
                        rules={{ required: "La categoría es obligatoria" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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
                        <span className="text-sm text-red-500">
                          {errors.categoryId.message}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="sleeveId"
                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Tipo de Manga
                      </label>
                      <Controller
                        name="sleeveId"
                        control={control}
                        rules={{ required: "El tipo de manga es obligatorio" }}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                          >
                            <option value="">Seleccionar tipo de manga</option>
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
                        <span className="text-sm text-red-500">
                          {errors.sleeveId.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "variants" && (
              <div className="space-y-6">
                {/* Alerta */}
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400 dark:text-blue-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-200">
                    <p className="font-semibold">Configuración de Variantes</p>
                    <p>
                      1. Seleccione un color y suba una imagen para ese color
                      <br />
                      2. Para cada color, agregue las tallas disponibles
                      <br />
                      3. Configure el precio por talla y el stock para cada
                      combinación
                    </p>
                  </div>
                </div>

                {/* Configuración de colores y tallas */}
                <div className="space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label
                        htmlFor="color"
                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Agregar Color
                      </label>
                      <select
                        id="color"
                        onChange={(e) => handleAddColor(e.target.value)}
                        className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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
                  <div className="flex flex-wrap gap-2">
                    {colorConfigs.map((config) => (
                      <div
                        key={config.colorId}
                        className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                          selectedColorId === config.colorId
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                        }`}
                        onClick={() => setSelectedColorId(config.colorId)}
                      >
                        {colors &&
                          colors.find((c) => c.id === config.colorId)?.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveColor(config.colorId);
                          }}
                          className="ml-2 p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Configuración de tallas para el color seleccionado */}
                  {selectedColorId && (
                    <div className="mt-4 bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Configuración para{" "}
                        {colors &&
                          colors.find((c) => c.id === selectedColorId)?.name}
                      </h3>
                      <div className="space-y-4">
                        {/* Imagen del color */}
                        <div className="flex items-center space-x-4">
                          <div className="w-32 h-32 relative">
                            <img
                              src={
                                colorConfigs.find(
                                  (c) => c.colorId === selectedColorId
                                )?.image ||
                                "/placeholder.svg?height=200&width=200"
                              }
                              alt={`Color ${
                                colors &&
                                colors.find((c) => c.id === selectedColorId)
                                  ?.name
                              }`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <label
                              htmlFor={`image-upload-${selectedColorId}`}
                              className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md"
                            >
                              <svg
                                className="h-4 w-4 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                              </svg>
                            </label>
                            <input
                              id={`image-upload-${selectedColorId}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(selectedColorId, e)
                              }
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor="size"
                              className="text-sm font-medium text-gray-700 dark:text-gray-200"
                            >
                              Agregar Talla
                            </label>
                            <select
                              id="size"
                              onChange={(e) =>
                                handleAddSize(selectedColorId, e.target.value)
                              }
                              className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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
                          </div>
                        </div>

                        {/* Lista de tallas y precios */}
                        <div className="grid gap-4">
                          {colorConfigs
                            .find(
                              (config) => config.colorId === selectedColorId
                            )
                            ?.sizes.map((sizeId) => (
                              <div
                                key={sizeId}
                                className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Talla{" "}
                                    {sizes &&
                                      sizes.find((s) => s.id === sizeId)?.name}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSize(selectedColorId, sizeId)
                                    }
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-full"
                                  >
                                    <svg
                                      className="h-4 w-4 text-gray-700 dark:text-gray-200"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <label
                                      htmlFor={`price-${sizeId}`}
                                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                      Precio
                                    </label>
                                    <input
                                      id={`price-${sizeId}`}
                                      type="number"
                                      value={
                                        colorConfigs.find(
                                          (c) => c.colorId === selectedColorId
                                        )?.prices[sizeId] || ""
                                      }
                                      onChange={(e) =>
                                        handlePriceChange(
                                          selectedColorId,
                                          sizeId,
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                                      placeholder="0.00"
                                      step="0.01"
                                      min="0"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <label
                                      htmlFor={`stock-${sizeId}`}
                                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                      Stock
                                    </label>
                                    <input
                                      id={`stock-${sizeId}`}
                                      type="number"
                                      value={
                                        colorConfigs.find(
                                          (c) => c.colorId === selectedColorId
                                        )?.stocks[sizeId] || ""
                                      }
                                      onChange={(e) =>
                                        handleStockChange(
                                          selectedColorId,
                                          sizeId,
                                          e.target.value
                                        )
                                      }
                                      className="w-full rounded-md p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                                      placeholder="0"
                                      min="0"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => {
            window.scrollTo(0, 0);
            onCancel();
          }}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isVariantsValid}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
            !isVariantsValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {product ? "Actualizar" : "Crear"} Producto
        </button>
      </div>
    </form>
  );
};

export default ProductForm;