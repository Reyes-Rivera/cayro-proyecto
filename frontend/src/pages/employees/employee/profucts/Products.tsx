import type React from "react"
import { useState } from "react"
import ProductList from "./components/ProductList"
import ProductDetails from "./components/ProductDetails"
import { type Product, sampleProducts } from "./data/sampleData"
import ProductForm from "./components/ProductForm"

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)

  const handleAddProduct = (newProduct: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const product: Product = {
      ...newProduct,
      id: products.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      variants: newProduct.variants.map((v, index) => ({
        ...v,
        id: index + 1,
        productId: products.length + 1,
      })),
    }
    setProducts([...products, product])
    setIsEditing(false)
  }

  const handleEditProduct = (updatedProduct: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    if (selectedProduct) {
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...selectedProduct,
              ...updatedProduct,
              updatedAt: new Date().toISOString(),
              variants: updatedProduct.variants.map((v, index) => ({
                ...v,
                id: index + 1,
                productId: selectedProduct.id,
              })),
            }
          : p,
      )
      setProducts(updatedProducts)
      setSelectedProduct(null)
      setIsEditing(false)
    }
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleViewProduct = (id: number) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      setSelectedProduct(product)
      setIsViewing(true)
    }
  }

  return (
    <div className="App bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard de Productos</h1>
        {!isEditing && !isViewing && (
          <>
            <ProductList
              products={products}
              onEdit={(id) => {
                const product = products.find((p) => p.id === id)
                if (product) {
                  setSelectedProduct(product)
                  setIsEditing(true)
                }
              }}
              onDelete={handleDeleteProduct}
              onView={handleViewProduct}
            />
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Agregar Producto
            </button>
          </>
        )}
        {isEditing && (
          <ProductForm
            product={selectedProduct || undefined}
            onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
            onCancel={() => {
              setSelectedProduct(null)
              setIsEditing(false)
            }}
          />
        )}
        {isViewing && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => {
              setSelectedProduct(null)
              setIsViewing(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Products

