import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import img from "@/assets/sudadera-removebg-preview.png";
import playera from "@/assets/470524508_1114544320459967_8053404278450786658_n-removebg-preview.png";

export default function ProductsSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSearchTerm, setActiveSearchTerm] = useState("");
  
    const categories = [
      { name: "Escolar", icon: "🎓" },
      { name: "Deportivo", icon: "⚽" },
      { name: "Gorras", icon: "🧢" },
      { name: "Playeras", icon: "👕" },
      { name: "Polos", icon: "🦴" },
      { name: "Pantalones", icon: "👖" },
      { name: "Shorts", icon: "🩳" },
      { name: "Accesorios", icon: "🎒" },
    ];
  
    const allProducts = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: i % 2 === 0 ? `Uniforme Escolar ${i + 1}` : `Uniforme Deportivo ${i + 1}`,
      category: i % 2 === 0 ? "Escolar" : "Deportivo",
      subCategory: categories[i % categories.length].name,
      price: (50 + i * 10).toFixed(2),
      image: "https://via.placeholder.com/150",
    }));
  
    const filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(activeSearchTerm.toLowerCase())
    );
  
    const itemsPerPage = 12;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
    const displayedProducts = filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
  
    const handlePreviousPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
  
    const handleSearchEnter = (e: any) => {
      if (e.key === "Enter") {
        setActiveSearchTerm(searchTerm);
      }
    };
  
    const handleSearchClick = () => {
      setActiveSearchTerm(searchTerm);
    };
  
    
  
    return (
      <div className="min-h-screen grid grid-cols-[auto,1fr] bg-white dark:bg-gray-900 pt-16">
        {/* Sidebar */}
        <div className="w-96 bg-gray-50 dark:bg-gray-800 p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Categorías</h2>
          </div>
    
          {/* Search Bar */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchEnter}
              className="w-full px-4 py-3 text-gray-800 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
            />
            <button
              onClick={handleSearchClick}
              className="px-5 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
    
          <div className="flex flex-col space-y-4 mt-6">
            {categories.map((cat, index) => (
              <div
                key={index}
                onClick={() => setActiveSearchTerm(cat.name)}
                className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600"
              >
                <div className="text-2xl">{cat.icon}</div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
    
        <div className="flex-1">
          <div className=" bg-blue-600 text-white  p-8 sm:px-32 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight   dark:text-white">
                ¿Quieres algo único?
              </h2>
              <p className="mt-2 text-sm sm:text-lg text-gray-600 dark:text-gray-300">
                Diseña tus uniformes personalizados para darle un toque especial que
                represente tu estilo.
              </p>
              <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105">
                Personalizar ahora
              </Button>
            </div>
    
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-blue-200 dark:bg-gray-700 rounded-full shadow-lg">
              <img
                src={playera}
                alt="Personalización"
                className="w-32 sm:w-32 sm:h-32 object-contain"
              />
            </div>
          </div>
    
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mt-8">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <div className="relative bg-gray-100 dark:bg-gray-700">
                  <img
                    src={img}
                    alt={product.name}
                    className="w-full h-44 sm:h-52 object-contain"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-100">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3 sm:mt-4">
                    <p className="font-semibold text-sm sm:text-lg text-gray-800 dark:text-gray-100">
                      ${product.price}
                    </p>
                    <button className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 dark:bg-blue-600 text-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-500">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
    
          {/* Pagination */}
          <div className="flex justify-center mt-8 sm:mt-12">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="mr-4"
            >
              Anterior
            </Button>
            <span className="text-lg sm:text-xl text-gray-800 dark:text-gray-100">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="ml-4"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    );
    
  }
  
