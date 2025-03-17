"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ProductForm from "./components/ProductForm";
import type { Product } from "./data/sampleData";
import {
  getProducts,
  activateProduct,
  deactivateProduct,
} from "@/api/products";
import { Loader2, Package2 } from "lucide-react";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (newProduct: Product) => {
    setIsLoading(true);
    setProducts([...products, newProduct]);
    setIsLoading(false);
    setIsEditing(false);
    window.scrollTo(0, 0);
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    if (selectedProduct) {
      setIsLoading(true);
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      setIsLoading(false);
      setSelectedProduct(null);
      setIsEditing(false);
    }
  };

  const handleActivateProduct = async (id: number) => {
    setIsLoading(true);
    try {
      // Llamar a la API para activar el producto
      await activateProduct(id);
      // Recargar la lista de productos
      await loadProducts();
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
      await loadProducts();
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

  const handleViewProduct = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsViewing(true); // Activar la vista de detalles
      setIsEditing(false); // Asegurarse de que el formulario de edición no esté activo
    }
  };

  const handleEdit = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsEditing(true);
      setIsViewing(false);
    }
  };

  const handleAddProductView = () => {
    setSelectedProduct(null);
    setIsEditing(true);
    setIsViewing(false);
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setIsViewing(false); // Volver a la lista de productos
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={64} />
      </div>
    );
  }

  return (
    <motion.div
      className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gray-50 dark:bg-gray-900 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Encabezado de Página */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 opacity-10 dark:opacity-20 rounded-xl sm:rounded-2xl md:rounded-3xl"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-white">
                  <Package2 className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Productos
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 max-w-2xl">
                    Administra el catálogo de productos de tu tienda. Añade,
                    edita y visualiza todos tus productos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>
        </div>
      </motion.div>

      {/* Mostrar el formulario, los detalles o la lista según el estado */}
      <motion.div variants={itemVariants}>
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
              onEdit={handleEdit}
              onView={handleViewProduct}
              onAdd={handleAddProductView}
              onActivate={handleActivateProduct}
              onDeactivate={handleDeactivateProduct}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Products;
