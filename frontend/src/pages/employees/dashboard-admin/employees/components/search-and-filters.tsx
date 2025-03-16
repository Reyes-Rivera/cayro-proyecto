"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Search,
  XCircle,
  Check,
} from "lucide-react";
import type { SortOption } from "../types/employee";
import { sortOptions } from "../constants/employee-constants";

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  showSortOptions: boolean;
  setShowSortOptions: (show: boolean) => void;
  refreshData: () => void;
  isRefreshing: boolean;
}

const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  showSortOptions,
  setShowSortOptions,
  refreshData,
  isRefreshing,
}: SearchAndFiltersProps) => {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
      <div className="relative flex-grow max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar empleados..."
          className="pl-10 pr-10 py-2 sm:py-3 w-full border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        {searchTerm && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => setSearchTerm("")}
          >
            <XCircle className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Dropdown de ordenación */}
        <div className="relative" data-sort-dropdown="true">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm text-sm"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden xs:inline">Ordenar</span>
            {showSortOptions ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </motion.button>

          <AnimatePresence>
            {showSortOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 z-10 overflow-hidden"
              >
                <div className="py-2">
                  {sortOptions.map((option:any) => (
                    <motion.button
                      key={`${option.value}-${option.direction}`}
                      whileHover={{
                        backgroundColor:
                          sortBy.value === option.value &&
                          sortBy.direction === option.direction
                            ? "rgba(37, 99, 235, 0.1)"
                            : "rgba(243, 244, 246, 0.5)",
                      }}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortOptions(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm ${
                        sortBy.value === option.value &&
                        sortBy.direction === option.direction
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex items-center">
                        {sortBy.value === option.value &&
                        sortBy.direction === option.direction ? (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <div className="w-4 h-4 mr-2" /> // Empty space for alignment
                        )}
                        <span>{option.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={refreshData}
          className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span className="sr-only">Refrescar</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm"
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Filtrar</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
