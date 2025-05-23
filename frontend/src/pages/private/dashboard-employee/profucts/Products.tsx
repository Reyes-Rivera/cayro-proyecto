import React from "react";
import { useState, useEffect } from "react";
import type { Product } from "./data/sampleData";
import {
  getProducts,
  activateProduct,
  deactivateProduct,
  getProductById,
} from "@/api/products";
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
  const [isLoading, setIsLoading] = useState(true);
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
        setCurrentFilters(params); // Store current filters
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      if (error.response?.status === 404) {
        // Handle 404 specifically - set products to empty array
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      } else {
        // Show error toast for other error types
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los productos. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load products with stored filters or default params
    loadProducts(currentFilters || "page=1&limit=10");
  }, []);

  const handleAddProduct = async (newProduct: Product) => {
    setIsLoading(true);
    try {
      await loadProducts(currentFilters);
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
        await loadProducts(currentFilters);
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
      await activateProduct(id);
      await loadProducts(currentFilters);

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
      await deactivateProduct(id);
      await loadProducts(currentFilters);

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

  const handleFilterChange = (filterParams: string) => {
    loadProducts(filterParams);
  };

  return (
    <div className="px-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isEditing && !selectedProduct ? (
        <div>
          <ProductForm
            product={undefined}
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
