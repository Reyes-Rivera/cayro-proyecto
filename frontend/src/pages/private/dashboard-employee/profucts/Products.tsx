"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Product } from "./data/sampleData";
import {
  getProducts,
  activateProduct,
  deactivateProduct,
  getProductById,
} from "@/api/products";
import { Loader2 } from "lucide-react";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ProductForm from "./components/ProductForm";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Inicialmente true para mostrar carga
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Modificar la función loadProducts para manejar mejor los parámetros y mostrar el estado de carga
  const loadProducts = async (params = "") => {
    console.log("Cargando productos con parámetros:", params);
    setError(null);
    setIsLoading(true);

    try {
      const response = await getProducts(params);
      console.log("Respuesta de la API:", response);

      if (response && response.data) {
        const data = response.data;
        setProducts(Array.isArray(data.data) ? data.data : []);
        setTotalProducts(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Formato de respuesta inesperado:", response);
        setError("La respuesta de la API no tiene el formato esperado");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError("No se pudieron cargar los productos. Inténtalo de nuevo.");

      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los productos. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Cargar productos iniciales con parámetros por defecto
    loadProducts("page=1&limit=10");
  }, []);

  const handleAddProduct = async (newProduct: Product) => {
    setIsLoading(true);
    try {
      // La lógica de creación ya está en el ProductForm
      // Aquí solo necesitamos recargar los productos
      await loadProducts("page=1&limit=10");
      setIsEditing(false);
      window.scrollTo(0, 0);

      Swal.fire({
        title: "¡Éxito!",
        text: "Producto añadido correctamente",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo añadir el producto. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    if (selectedProduct) {
      setIsLoading(true);
      try {
        // La lógica de actualización ya está en el ProductForm
        // Aquí solo necesitamos recargar los productos
        await loadProducts("page=1&limit=10");
        setSelectedProduct(null);
        setIsEditing(false);

        Swal.fire({
          title: "¡Éxito!",
          text: "Producto actualizado correctamente",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      } catch (error) {
        console.error("Error updating product:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el producto. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleActivateProduct = async (id: number) => {
    setIsLoading(true);
    try {
      // Llamar a la API para activar el producto
      await activateProduct(id);
      // Recargar la lista de productos
      await loadProducts("page=1&limit=10");

      Swal.fire({
        title: "¡Activado!",
        text: "El producto ha sido activado correctamente.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error("Error al activar el producto:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo activar el producto. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateProduct = async (id: number) => {
    setIsLoading(true);
    try {
      // Llamar a la API para desactivar el producto
      await deactivateProduct(id);
      // Recargar la lista de productos
      await loadProducts("page=1&limit=10");

      Swal.fire({
        title: "¡Desactivado!",
        text: "El producto ha sido desactivado correctamente.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error("Error al desactivar el producto:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo desactivar el producto. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = async (id: number) => {
    setIsLoading(true);
    try {
      // Obtener los detalles completos del producto desde la API
      const response = await getProductById(id);
      if (response && response.data) {
        setSelectedProduct(response.data);
        setIsViewing(true);
        setIsEditing(false);
      } else {
        throw new Error("No se pudo obtener la información del producto");
      }
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los detalles del producto.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    setIsLoading(true);
    try {
      // Obtener los detalles completos del producto desde la API
      const response = await getProductById(id);
      if (response && response.data) {
        setSelectedProduct(response.data);
        setIsEditing(true);
        setIsViewing(false);
      } else {
        throw new Error("No se pudo obtener la información del producto");
      }
    } catch (error) {
      console.error(
        "Error al obtener detalles del producto para editar:",
        error
      );
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los detalles del producto para editar.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProductView = () => {
    setSelectedProduct(null);
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setIsViewing(false);
  };

  // Función para manejar cambios en los filtros desde ProductList
  const handleFilterChange = (filterParams: string) => {
    loadProducts(filterParams);
  };

  // Renderizado condicional basado en el estado
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2
          className="animate-spin text-blue-600 dark:text-blue-400 mb-4"
          size={64}
        />
        <p className="text-gray-600 dark:text-gray-400">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => loadProducts("page=1&limit=10")}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Mostrar el formulario, los detalles o la lista según el estado */}
      {isEditing && !selectedProduct ? (
        // Formulario para Agregar Producto
        <div>
          <ProductForm
            product={undefined} // No hay producto seleccionado
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onCancel={() => {
              setSelectedProduct(null);
              setIsEditing(false);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      ) : isEditing && selectedProduct ? (
        // Formulario para Editar Producto
        <div>
          <ProductForm
            product={selectedProduct}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onCancel={() => {
              setSelectedProduct(null);
              setIsEditing(false);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      ) : isViewing && selectedProduct ? (
        // Detalles del Producto
        <div>
          <ProductDetails product={selectedProduct} onBack={handleBack} />
        </div>
      ) : (
        // Tabla de Productos
        <div>
          <ProductList
            products={products}
            totalProducts={totalProducts}
            totalPages={totalPages}
            onEdit={handleEdit}
            onView={handleViewProduct}
            onAdd={handleAddProductView}
            onActivate={handleActivateProduct}
            onDeactivate={handleDeactivateProduct}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}
    </div>
  );
};

export default Products;
