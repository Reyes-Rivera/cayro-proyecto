import type React from "react";
import { useState } from "react";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import { type Product, sampleProducts } from "./data/sampleData";
import ProductForm from "./components/ProductForm";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

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
    };
    setProducts([...products, product]);
    setIsEditing(false);
  };

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
      );
      setProducts(updatedProducts);
      setSelectedProduct(null);
      setIsEditing(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleViewProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsViewing(true);
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center sm:p-6 dark:text-gray-100">
      {/* Encabezado de Página */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-7xl rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gestión de Productos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Administra los productos fácilmente.
          </p>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="w-full max-w-7xl overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Lista de Productos
        </h2>
        <ProductList
          products={products}
          onEdit={(id) => {
            const product = products.find((p) => p.id === id);
            if (product) {
              setSelectedProduct(product);
              setIsEditing(true);
            }
          }}
          onDelete={handleDeleteProduct}
          onView={handleViewProduct}
        />
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-4"
        >
          Agregar Producto
        </button>
      </div>

      {/* Modal para Agregar/Editar Producto */}
      {(isEditing || selectedProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {selectedProduct ? "Editar Producto" : "Agregar Producto"}
            </h2>
            <ProductForm
              product={selectedProduct || undefined}
              onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
              onCancel={() => {
                setSelectedProduct(null);
                setIsEditing(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal para Ver Detalles del Producto */}
      {isViewing && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <ProductDetails
              product={selectedProduct}
              onBack={() => {
                setSelectedProduct(null);
                setIsViewing(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;