"use client";

import { motion } from "framer-motion";
import { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  paginate: (pageNumber: number) => void;
  totalItems: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

// Constantes fuera del componente
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  paginate,
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
}: PaginationProps) => {
  // Memoized pagination info
  const paginationInfo = useMemo(() => ({
    showingStart: indexOfFirstItem + 1,
    showingEnd: Math.min(indexOfLastItem, totalItems),
    total: totalItems,
    displayTotalPages: totalPages || 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages || totalPages === 0
  }), [currentPage, totalPages, indexOfFirstItem, indexOfLastItem, totalItems]);

  // Memoized handlers
  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
  }, [setItemsPerPage]);

  const handlePreviousPage = useCallback(() => {
    if (!paginationInfo.isFirstPage) {
      paginate(currentPage - 1);
    }
  }, [currentPage, paginate, paginationInfo.isFirstPage]);

  const handleNextPage = useCallback(() => {
    if (!paginationInfo.isLastPage) {
      paginate(currentPage + 1);
    }
  }, [currentPage, paginate, paginationInfo.isLastPage]);

  // Base classes para consistencia
  const baseClasses = {
    select: "border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm p-1 sm:p-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
    button: "px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-700",
    currentPage: "px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md sm:rounded-lg text-blue-700 dark:text-blue-400 font-medium"
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
      role="navigation"
      aria-label="Paginación"
    >
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-gray-500 dark:text-gray-400">Mostrar</span>
        <select
          className={baseClasses.select}
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          aria-label="Elementos por página"
        >
          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-gray-500 dark:text-gray-400">por página</span>
      </div>

      {/* Page info */}
      <div 
        className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center"
        aria-live="polite"
        aria-atomic="true"
      >
        Mostrando{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {paginationInfo.showingStart}
        </span>{" "}
        a{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {paginationInfo.showingEnd}
        </span>{" "}
        de{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {paginationInfo.total}
        </span>{" "}
        empleados
      </div>

      {/* Page navigation */}
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        <motion.button
          {...buttonHover}
          className={baseClasses.button}
          disabled={paginationInfo.isFirstPage}
          onClick={handlePreviousPage}
          aria-label="Página anterior"
          aria-disabled={paginationInfo.isFirstPage}
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
        </motion.button>

        {/* Current page indicator */}
        <div 
          className="flex items-center text-xs sm:text-sm"
          aria-label={`Página actual: ${currentPage} de ${paginationInfo.displayTotalPages}`}
        >
          <span className={baseClasses.currentPage}>
            {currentPage}
          </span>
          <span className="mx-1 text-gray-500 dark:text-gray-400" aria-hidden="true">
            de
          </span>
          <span className="text-gray-700 dark:text-gray-300">
            {paginationInfo.displayTotalPages}
          </span>
        </div>

        {/* Next page button */}
        <motion.button
          {...buttonHover}
          className={baseClasses.button}
          disabled={paginationInfo.isLastPage}
          onClick={handleNextPage}
          aria-label="Página siguiente"
          aria-disabled={paginationInfo.isLastPage}
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Pagination;
