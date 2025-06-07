"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  // Función para generar el array de páginas a mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Número máximo de páginas a mostrar

    if (totalPages <= maxPagesToShow) {
      // Si hay menos páginas que el máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Siempre mostrar la primera página
      pageNumbers.push(1);

      // Calcular el rango de páginas a mostrar alrededor de la página actual
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Ajustar si estamos cerca del inicio o del final
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Añadir elipsis si es necesario
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Añadir páginas intermedias
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Añadir elipsis si es necesario
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Siempre mostrar la última página
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      // Scroll to products section
      const productsSection = document.getElementById("products-grid");
      if (productsSection) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    
    }
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="flex items-center space-x-2">
        {/* Botón anterior */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Números de página */}
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentPage === page
                    ? "bg-blue-600 text-white font-medium shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </motion.button>
            )}
          </div>
        ))}

        {/* Botón siguiente */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg ${
            currentPage === totalPages
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
