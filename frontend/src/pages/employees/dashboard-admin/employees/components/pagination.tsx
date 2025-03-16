"use client";

import { motion } from "framer-motion";
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
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={fadeIn}
      className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-gray-500 dark:text-gray-400">Mostrar</span>
        <select
          className="border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm p-1 sm:p-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span className="text-gray-500 dark:text-gray-400">por página</span>
      </div>

      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
        Mostrando {indexOfFirstItem + 1} a{" "}
        {Math.min(indexOfLastItem, totalItems)} de {totalItems} empleados
      </div>

      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          disabled={currentPage === 1}
          onClick={() => paginate(currentPage - 1)}
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.button>

        <div className="flex items-center text-xs sm:text-sm">
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md sm:rounded-lg text-blue-700 dark:text-blue-400 font-medium">
            {currentPage}
          </span>
          <span className="mx-1 text-gray-500 dark:text-gray-400">de</span>
          <span className="text-gray-700 dark:text-gray-300">
            {totalPages || 1}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => paginate(currentPage + 1)}
        >
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Pagination;
