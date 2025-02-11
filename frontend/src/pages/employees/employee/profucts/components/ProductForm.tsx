import type React from "react"
import { useState, useEffect } from "react"
import {
  type Product,
  type ProductVariant,
  sampleBrands,
  sampleGenders,
  sampleNeckTypes,
  sampleCategories,
  sampleColors,
  sampleSizes,
} from "../data/sampleData"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ColorSizeConfig {
  colorId: number
  sizes: number[]
  prices: { [key: number]: number }
  stocks: { [key: number]: number }
  image: string
}

interface ProductFormProps {
  product?: Product
  onSubmit: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Product, "id" | "createdAt" | "updatedAt">>({
    name: "",
    description: "",
    active: true,
    brandId: 1,
    genderId: 1,
    neckTypeId: null,
    categoryId: 1,
    variants: [],
  })

  const [colorConfigs, setColorConfigs] = useState<ColorSizeConfig[]>([])
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        active: product.active,
        brandId: product.brandId,
        genderId: product.genderId,
        neckTypeId: product.neckTypeId,
        categoryId: product.categoryId,
        variants: product.variants,
      })

      // Group variants by color
      const configsByColor = product.variants.reduce((acc: ColorSizeConfig[], variant) => {
        const existingConfig = acc.find((config) => config.colorId === variant.colorId)
        if (existingConfig) {
          if (!existingConfig.sizes.includes(variant.sizeId)) {
            existingConfig.sizes.push(variant.sizeId)
          }
          existingConfig.prices[variant.sizeId] = variant.price
          existingConfig.stocks[variant.sizeId] = variant.stock
        } else {
          acc.push({
            colorId: variant.colorId,
            sizes: [variant.sizeId],
            prices: { [variant.sizeId]: variant.price },
            stocks: { [variant.sizeId]: variant.stock },
            image: "/placeholder.svg?height=200&width=200",
          })
        }
        return acc
      }, [])

      setColorConfigs(configsByColor)
    }
  }, [product])

  const handleChange = (name: string, value: string | boolean | number | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddColor = (colorId: string) => {
    const numericColorId = Number.parseInt(colorId, 10)
    if (!colorConfigs.some((config) => config.colorId === numericColorId)) {
      setColorConfigs((prev) => [
        ...prev,
        {
          colorId: numericColorId,
          sizes: [],
          prices: {},
          stocks: {},
          image: "/placeholder.svg?height=200&width=200",
        },
      ])
      setSelectedColorId(numericColorId)
    }
  }

  const handleRemoveColor = (colorId: number) => {
    setColorConfigs((prev) => prev.filter((config) => config.colorId !== colorId))
    if (selectedColorId === colorId) {
      setSelectedColorId(null)
    }
  }

  const handleAddSize = (colorId: number, sizeId: string) => {
    const numericSizeId = Number.parseInt(sizeId, 10)
    setColorConfigs((prev) =>
      prev.map((config) =>
        config.colorId === colorId
          ? {
              ...config,
              sizes: [...config.sizes, numericSizeId],
              prices: { ...config.prices, [numericSizeId]: 0 },
              stocks: { ...config.stocks, [numericSizeId]: 0 },
            }
          : config,
      ),
    )
  }

  const handleRemoveSize = (colorId: number, sizeId: number) => {
    setColorConfigs((prev) =>
      prev.map((config) => {
        if (config.colorId === colorId) {
          const { [sizeId]: priceToRemove, ...remainingPrices } = config.prices
          const { [sizeId]: stockToRemove, ...remainingStocks } = config.stocks
          return {
            ...config,
            sizes: config.sizes.filter((id) => id !== sizeId),
            prices: remainingPrices,
            stocks: remainingStocks,
          }
        }
        return config
      }),
    )
  }

  const handlePriceChange = (colorId: number, sizeId: number, price: string) => {
    setColorConfigs((prev) =>
      prev.map((config) =>
        config.colorId === colorId
          ? {
              ...config,
              prices: { ...config.prices, [sizeId]: Number(price) || 0 },
            }
          : config,
      ),
    )
  }

  const handleStockChange = (colorId: number, sizeId: number, stock: string) => {
    setColorConfigs((prev) =>
      prev.map((config) =>
        config.colorId === colorId
          ? {
              ...config,
              stocks: { ...config.stocks, [sizeId]: Number(stock) || 0 },
            }
          : config,
      ),
    )
  }

  const handleImageUpload = (colorId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setColorConfigs((prev) =>
          prev.map((config) =>
            config.colorId === colorId
              ? {
                  ...config,
                  image: reader.result as string,
                }
              : config,
          ),
        )
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const variants: ProductVariant[] = []

    colorConfigs.forEach((config) => {
      config.sizes.forEach((sizeId) => {
        variants.push({
          id: 0, // Temporary ID, will be replaced when saved to the database
          productId: 0, // Temporary productId, will be replaced when saved to the database
          colorId: config.colorId,
          sizeId,
          price: config.prices[sizeId] || 0,
          stock: config.stocks[sizeId] || 0,
          barcode: `${formData.name}-${config.colorId}-${sizeId}`,
        })
      })
    })

    onSubmit({ ...formData, variants })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Editar Producto" : "Agregar Nuevo Producto"}</CardTitle>
          <CardDescription>
            Complete la información del producto y configure sus variantes por color y talla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Información Básica</TabsTrigger>
              <TabsTrigger value="variants">Variantes</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Información del Producto</AlertTitle>
                <AlertDescription>
                  Complete la información básica del producto antes de configurar las variantes.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre del producto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nombre del producto"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Descripción del producto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="brandId">Marca</Label>
                    <Select
                      value={formData.brandId.toString()}
                      onValueChange={(value) => handleChange("brandId", Number.parseInt(value, 10))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="genderId">Género</Label>
                    <Select
                      value={formData.genderId.toString()}
                      onValueChange={(value) => handleChange("genderId", Number.parseInt(value, 10))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar género" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleGenders.map((gender) => (
                          <SelectItem key={gender.id} value={gender.id.toString()}>
                            {gender.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoryId">Categoría</Label>
                    <Select
                      value={formData.categoryId.toString()}
                      onValueChange={(value) => handleChange("categoryId", Number.parseInt(value, 10))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="neckTypeId">Tipo de Cuello</Label>
                    <Select
                      value={formData.neckTypeId?.toString() || "0"}
                      onValueChange={(value) => handleChange("neckTypeId", value === "0" ? null : Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo de cuello" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Ninguno</SelectItem>
                        {sampleNeckTypes.map((neckType) => (
                          <SelectItem key={neckType.id} value={neckType.id.toString()}>
                            {neckType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuración de Variantes</AlertTitle>
                <AlertDescription>
                  1. Seleccione un color y suba una imagen para ese color
                  <br />
                  2. Para cada color, agregue las tallas disponibles
                  <br />
                  3. Configure el precio por talla y el stock para cada combinación
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Agregar Color</Label>
                    <Select onValueChange={handleAddColor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar color" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleColors
                          .filter((color) => !colorConfigs.some((config) => config.colorId === color.id))
                          .map((color) => (
                            <SelectItem key={color.id} value={color.id.toString()}>
                              {color.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {colorConfigs.map((config) => (
                    <Badge
                      key={config.colorId}
                      variant={selectedColorId === config.colorId ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedColorId(config.colorId)}
                    >
                      {sampleColors.find((c) => c.id === config.colorId)?.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveColor(config.colorId)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>

                {selectedColorId && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Configuración para {sampleColors.find((c) => c.id === selectedColorId)?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-32 h-32 relative">
                            <img
                              src={
                                colorConfigs.find((c) => c.colorId === selectedColorId)?.image ||
                                "/placeholder.svg?height=200&width=200"
                              }
                              alt={`Color ${sampleColors.find((c) => c.id === selectedColorId)?.name}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <Label
                              htmlFor={`image-upload-${selectedColorId}`}
                              className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md"
                            >
                              <Upload className="h-4 w-4" />
                            </Label>
                            <Input
                              id={`image-upload-${selectedColorId}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(selectedColorId, e)}
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Agregar Talla</Label>
                            <Select onValueChange={(sizeId) => handleAddSize(selectedColorId, sizeId)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar talla" />
                              </SelectTrigger>
                              <SelectContent>
                                {sampleSizes
                                  .filter(
                                    (size) =>
                                      !colorConfigs
                                        .find((config) => config.colorId === selectedColorId)
                                        ?.sizes.includes(size.id),
                                  )
                                  .map((size) => (
                                    <SelectItem key={size.id} value={size.id.toString()}>
                                      {size.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          {colorConfigs
                            .find((config) => config.colorId === selectedColorId)
                            ?.sizes.map((sizeId) => (
                              <Card key={sizeId}>
                                <CardContent className="pt-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold">
                                      Talla {sampleSizes.find((s) => s.id === sizeId)?.name}
                                    </h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveSize(selectedColorId, sizeId)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label>Precio</Label>
                                      <Input
                                        type="number"
                                        value={
                                          colorConfigs.find((c) => c.colorId === selectedColorId)?.prices[sizeId] || ""
                                        }
                                        onChange={(e) => handlePriceChange(selectedColorId, sizeId, e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Stock</Label>
                                      <Input
                                        type="number"
                                        value={
                                          colorConfigs.find((c) => c.colorId === selectedColorId)?.stocks[sizeId] || ""
                                        }
                                        onChange={(e) => handleStockChange(selectedColorId, sizeId, e.target.value)}
                                        placeholder="0"
                                        min="0"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{product ? "Actualizar" : "Crear"} Producto</Button>
      </div>
    </form>
  )
}

export default ProductForm

