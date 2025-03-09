/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from "react";
import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ProductForm from "./components/ProductForm";
import {
  type Product,
  type CreateProductDto,
} from "./data/sampleData";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "@/api/products";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos desde el backend
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data.data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Función para agregar un producto
  const handleAddProduct = async (newProduct: CreateProductDto) => {
    setIsLoading(true);
    try {
      const createdProduct = await createProduct(newProduct);
      setProducts([...products, createdProduct.data]);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      setError("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para editar un producto
  const handleEditProduct = async (updatedProduct: CreateProductDto) => {
    if (selectedProduct) {
      setIsLoading(true);
      try {
        const updated = await updateProduct(updatedProduct, Number(selectedProduct.id));
        const updatedProducts = products.map((p) =>
          p.id === selectedProduct.id ? updated.data : p
        );
        setProducts(updatedProducts);
        setSelectedProduct(null);
        setIsEditing(false);
      } catch (err) {
        setError("Failed to update product");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para ver los detalles de un producto
  const handleViewProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsViewing(true);
    }
  };

  // Mostrar un mensaje de carga
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Mostrar un mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

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

      {/* Contenedor principal */}
      <div className="w-full max-w-7xl overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800 p-6">
        {/* Mostrar el formulario o la tabla según el estado */}
        {isEditing || selectedProduct ? (
          // Formulario para Agregar/Editar Producto
          <div>
            <ProductForm
              product={selectedProduct || undefined}
              onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
              onCancel={() => {
                setSelectedProduct(null);
                setIsEditing(false);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        ) : (
          // Tabla de Productos
          <div>
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
        )}
      </div>

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