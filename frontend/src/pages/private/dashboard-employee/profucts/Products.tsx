"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { CreateProductDto, Product } from "./data/sampleData";
import {
  getProducts,
  activateProduct,
  deactivateProduct,
  getProductById,
  createProduct,
  updateProduct,
} from "@/api/products";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ProductForm from "./components/ProductForm";
import { AlertHelper } from "@/utils/alert.util";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false); // Nuevo estado para loading del formulario
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState("");

  const loadProducts = async (params = "") => {
    setIsLoading(true);
    try {
      const response = await getProducts(params);
      if (response && response.data) {
        const data = response.data;
        setProducts(Array.isArray(data.data) ? data.data : []);
        setTotalProducts(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentFilters(params);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      } else {
        AlertHelper.error({
          title: "Error",
          error,
          message: "No se pudieron cargar los productos. Inténtalo de nuevo.",
          animation: "fadeIn",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(currentFilters || "page=1&limit=10");
  }, []);

  const handleAddProduct = async (newProduct: CreateProductDto) => {
    setIsFormLoading(true);
    try {
      await createProduct(newProduct);
      await loadProducts(currentFilters);
      setIsEditing(false);
      window.scrollTo(0, 0);
      AlertHelper.success({
        title: "¡Éxito!",
        message: "Producto añadido correctamente",
        animation: "fadeIn",
      });
    } catch (error: any) {
      AlertHelper.error({
        title: "Error",
        error,
        message:
          error.response?.data?.message ||
          "No se pudo añadir el producto. Inténtalo de nuevo.",
        animation: "fadeIn",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEditProduct = async (
    updatedProduct: CreateProductDto,
    id: number
  ) => {
    if (selectedProduct) {
      setIsFormLoading(true);
      try {
        await updateProduct(updatedProduct, id);
        await loadProducts(currentFilters);
        setSelectedProduct(undefined);
        setIsEditing(false);
        AlertHelper.success({
          title: "¡Éxito!",
          message: "Producto actualizado correctamente",
          animation: "fadeIn",
        });
      } catch (error) {
        AlertHelper.error({
          title: "Error",
          error,
          message: "No se pudo actualizar el producto. Inténtalo de nuevo.",
          animation: "fadeIn",
        });
      } finally {
        setIsFormLoading(false);
      }
    }
  };

  const handleActivateProduct = async (id: number) => {
    setIsLoading(true);
    try {
      await activateProduct(id);
      await loadProducts(currentFilters);
      AlertHelper.success({
        title: "¡Activado!",
        message: "El producto ha sido activado correctamente.",
        animation: "fadeIn",
      });
    } catch (error) {
      AlertHelper.error({
        title: "Error",
        error,
        message: "No se pudo activar el producto. Inténtalo de nuevo.",
        animation: "fadeIn",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateProduct = async (id: number) => {
    setIsLoading(true);
    try {
      await deactivateProduct(id);
      await loadProducts(currentFilters);
      AlertHelper.success({
        title: "¡Desactivado!",
        message: "El producto ha sido desactivado correctamente.",
        animation: "fadeIn",
      });
    } catch (error) {
      AlertHelper.error({
        title: "Error",
        error,
        message: "No se pudo desactivar el producto. Inténtalo de nuevo.",
        animation: "fadeIn",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = async (id: number) => {
    setIsFormLoading(true);
    try {
      const response = await getProductById(+id);
      if (response && response.data) {
        setSelectedProduct(response.data);
        setIsViewing(true);
        setIsEditing(false);
      } else {
        throw new Error("No se pudo obtener la información del producto");
      }
    } catch (error) {
      AlertHelper.error({
        title: "Error",
        error,
        message: "No se pudieron cargar los detalles del producto.",
        animation: "fadeIn",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleEdit = async (id: number) => {
    setIsFormLoading(true);
    try {
      const response = await getProductById(id);
      if (response && response.data) {
        setSelectedProduct(response.data);
        setIsEditing(true);
        setIsViewing(false);
      } else {
        throw new Error("No se pudo obtener la información del producto");
      }
    } catch (error) {
      AlertHelper.error({
        title: "Error",
        error,
        message: "No se pudieron cargar los detalles del producto para editar.",
        animation: "fadeIn",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleAddProductView = () => {
    setSelectedProduct(undefined);
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleBack = () => {
    setSelectedProduct(undefined);
    setIsViewing(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFilterChange = (filterParams: string) => {
    loadProducts(filterParams);
  };

  // Mostrar loading cuando se está cargando el formulario o la vista de detalles
  if (isFormLoading) {
    return (
      <div className="space-y-6 h-screen  dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col h-screen items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            {isEditing
              ? "Cargando formulario de edición..."
              : isViewing
              ? "Cargando detalles del producto..."
              : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isEditing ? (
        <div>
          <ProductForm
            product={selectedProduct}
            onAdd={handleAddProduct}
            onEdit={handleEditProduct}
            onCancel={() => {
              setSelectedProduct(undefined);
              setIsEditing(false);
              window.scrollTo(0, 0);
            }}
          />
        </div>
      ) : isViewing && selectedProduct ? (
        <div>
          <ProductDetails product={selectedProduct} onBack={handleBack} />
        </div>
      ) : (
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
            isTableLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Products;
