import type React from "react";
import { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import ProductForm from "./components/ProductForm";
import { type Product, type CreateProductDto } from "./data/sampleData";
import { updateProduct, deleteProduct, getProducts } from "@/api/products";
import { Loader2, Package2 } from "lucide-react";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      const data = await getProducts();
      setProducts(data.data);
      setIsLoading(false);
    };

    loadProducts();
  }, []);

  const handleAddProduct = async (newProduct: Product) => {
    setIsLoading(true);
    setProducts([...products, newProduct]);
    setIsLoading(false);
    setIsEditing(false);
    window.scrollTo(0, 0);
  };

  const handleEditProduct = async (updatedProduct: CreateProductDto) => {
    if (selectedProduct) {
      setIsLoading(true);

      const updated = await updateProduct(
        updatedProduct,
        Number(selectedProduct.id)
      );
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? updated.data : p
      );

      setProducts(updatedProducts);
      setSelectedProduct(null);
      setIsEditing(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setIsLoading(true);

    await deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={64} />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center dark:text-gray-100 ">
      {/* Contenedor principal */}

      <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 p-6 ">
      <div className="bg-blue-600 text-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-8">
        <div className=" p-6 ">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Package2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Productos</h1>
              <p className="text-gray-100">
                Administra tu catalogo de productos.
              </p>
            </div>
          </div>
        </div>
      </div>
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
              onEdit={handleEdit}
              onDelete={handleDeleteProduct}
              onView={handleViewProduct}
              onAdd={handleAddProductView}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
