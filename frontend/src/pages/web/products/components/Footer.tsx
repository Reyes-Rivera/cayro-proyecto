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
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Mostrar menos páginas en móviles
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Ajustes para móviles
      if (window.innerWidth < 640) {
        if (currentPage <= 2) {
          endPage = 2;
        } else if (currentPage >= totalPages - 1) {
          startPage = totalPages - 1;
        } else {
          startPage = currentPage;
          endPage = currentPage;
        }
      } else {
        if (currentPage <= 3) {
          endPage = 4;
        } else if (currentPage >= totalPages - 2) {
          startPage = totalPages - 3;
        }
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const productsSection = document.getElementById("products-grid");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center mt-12 sm:mt-16 md:mt-20 px-4"
    >
      <div className="flex items-center space-x-1 xs:space-x-2 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-xl border border-gray-100 dark:border-gray-800 overflow-x-auto max-w-full">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
            currentPage === 1
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Page Numbers - Responsive */}
        <div className="flex space-x-1 xs:space-x-2">
          {getPageNumbers().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-2 sm:px-3 text-gray-500 dark:text-gray-400 flex items-center justify-center">
                  ...
                </span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base font-semibold transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                      : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  {page}
                </motion.button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all ${
            currentPage === totalPages
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
