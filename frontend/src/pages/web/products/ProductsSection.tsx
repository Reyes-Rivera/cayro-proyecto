import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, ChevronLeft, ChevronRight } from "lucide-react";
import img from "@/assets/sudadera-removebg-preview.png";
import playera from "@/assets/470524508_1114544320459967_8053404278450786658_n-removebg-preview.png"
export default function ProductsSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSearchTerm, setActiveSearchTerm] = useState("");
    const carouselRef = useRef<HTMLDivElement>(null);

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

    const filteredProducts = allProducts.filter((product) =>
    (product.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(activeSearchTerm.toLowerCase()))
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

    const scrollCarousel = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const scrollAmount = direction === "left" ? -200 : 200;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Encabezado */}
            <header className="relative py-12 sm:py-16 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 text-white overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Descubre Cayro Uniformes
                    </h1>
                    <p className="mt-4 text-sm sm:text-lg text-blue-100 dark:text-gray-300">
                        Encuentra los mejores productos de calidad para cada ocasión.
                    </p>
                    <div className="mt-6 flex justify-center items-center gap-3 sm:gap-4">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchEnter}
                            className="w-full dark:text-white max-w-xs sm:max-w-md px-3 py-2 sm:px-4 sm:py-3 text-gray-800 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                        />
                        <button
                            onClick={handleSearchClick}
                            className="px-4 py-2 sm:px-5 sm:py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-bold rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-transform transform hover:scale-105"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Sección de personalización */}

                </div>
            </header>

            <div className="relative  bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-lg shadow-lg p-8 sm:px-32   flex flex-col sm:flex-row items-center justify-between gap-6 ">
                <div className="text-center sm:text-left ">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                        ¿Quieres algo único?
                    </h2>
                    <p className="mt-2 text-sm sm:text-lg text-gray-600 dark:text-gray-300">
                        Diseña tus uniformes personalizados para darle un toque especial que represente tu estilo.
                    </p>
                    <Button
                        className="mt-4 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 px-6 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
                    >
                        Personalizar ahora
                    </Button>
                </div>

                {/* Ícono decorativo */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-blue-100 dark:bg-gray-700 rounded-full shadow-lg">
                    <img
                        src={playera}
                        alt="Personalización"
                        className="w-32 sm:w-32 sm:h-32 object-contain"
                    />
                </div>
            </div>
            {/* Carrusel de categorías */}
            <div className="flex items-center py-6 px-4 sm:px-8 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                <button
                    onClick={() => scrollCarousel("left")}
                    className="hidden sm:flex absolute left-0 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-700 text-blue-500 rounded-full shadow-md hover:bg-blue-100 dark:hover:bg-gray-600 md:flex items-center justify-center"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div
                    ref={carouselRef}
                    className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide scroll-smooth w-full px-2 sm:px-12"
                >
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveSearchTerm(cat.name)}
                            className="flex-shrink-0 p-3 sm:p-4 w-36 sm:w-48 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                        >
                            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-center">{cat.icon}</div>
                            <p className="text-center text-gray-800 dark:text-gray-300 font-semibold text-sm sm:text-base">
                                {cat.name}
                            </p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => scrollCarousel("right")}
                    className="hidden sm:flex absolute right-0 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-700 text-blue-500 rounded-full shadow-md hover:bg-blue-100 dark:hover:bg-gray-600 md:flex items-center justify-center"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Contenido principal */}
            <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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

                {/* Paginación */}
                <div className="flex justify-center items-center mt-10 space-x-4 sm:space-x-6">
                    <Button
                        disabled={currentPage === 1}
                        onClick={handlePreviousPage}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg ${currentPage === 1
                            ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
                            }`}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        disabled={currentPage === totalPages}
                        onClick={handleNextPage}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg ${currentPage === totalPages
                            ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
                            }`}
                    >
                        Siguiente
                    </Button>
                </div>
            </main>
        </div>
    );
}
