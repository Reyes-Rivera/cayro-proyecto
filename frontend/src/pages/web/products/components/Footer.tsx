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
  const handlePageChange = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-center mt-12"
    >
      <nav className="flex items-center gap-2">
        {currentPage > 1 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
              currentPage === page
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </motion.button>
        ))}

        {currentPage < totalPages && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
            aria-label="Siguiente página"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        )}
      </nav>
    </motion.div>
  );
}
