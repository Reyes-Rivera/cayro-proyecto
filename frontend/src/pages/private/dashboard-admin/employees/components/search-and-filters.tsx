"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useCallback } from "react";
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

// Constantes fuera del componente
const animationVariants = {
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
  clearButton: {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  },
  dropdown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  dropdownItem: {
    hover: (isActive: boolean) => ({
      backgroundColor: isActive
        ? "rgba(37, 99, 235, 0.1)"
        : "rgba(243, 244, 246, 0.5)",
    }),
  },
};

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
  // Memoized handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, [setSearchTerm]);

  const toggleSortOptions = useCallback(() => {
    setShowSortOptions(!showSortOptions);
  }, [showSortOptions, setShowSortOptions]);

  const handleSortSelect = useCallback(
    (option: SortOption) => {
      setSortBy(option);
      setShowSortOptions(false);
    },
    [setSortBy, setShowSortOptions]
  );

  // Memoized base classes para consistencia
  const baseClasses = useMemo(
    () => ({
      input:
        "pl-10 pr-10 py-2 sm:py-3 w-full border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm",
      button:
        "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800",
      iconButton:
        "p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800",
    }),
    []
  );

  // Componente de ítem del dropdown de ordenación
  const SortOptionItem = useCallback(
    ({ option }: { option: SortOption }) => {
      const isActive =
        sortBy.value === option.value && sortBy.direction === option.direction;

      return (
        <motion.button
          custom={isActive}
          variants={animationVariants.dropdownItem}
          whileHover="hover"
          onClick={() => handleSortSelect(option)}
          className={`w-full text-left px-4 py-2.5 text-sm ${
            isActive
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset`}
          role="menuitem"
          aria-checked={isActive}
        >
          <div className="flex items-center">
            {isActive ? (
              <Check
                className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
            ) : (
              <div className="w-4 h-4 mr-2" aria-hidden="true" />
            )}
            <span>{option.label}</span>
          </div>
        </motion.button>
      );
    },
    [sortBy, handleSortSelect]
  );

  return (
    <div
      className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750"
      role="search"
      aria-label="Buscar y filtrar empleados"
    >
      {/* Search Input */}
      <div className="relative flex-grow max-w-md w-full">
        <div
          className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          aria-hidden="true"
        >
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar empleados..."
          className={baseClasses.input}
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Buscar empleados"
        />
        {searchTerm && (
          <motion.button
            variants={animationVariants.clearButton}
            whileHover="hover"
            whileTap="tap"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            onClick={handleClearSearch}
            aria-label="Limpiar búsqueda"
          >
            <XCircle className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Sort Dropdown */}
        <div className="relative">
          <motion.button
            variants={animationVariants.button}
            whileHover="hover"
            whileTap="tap"
            className={baseClasses.button}
            onClick={toggleSortOptions}
            aria-expanded={showSortOptions}
            aria-haspopup="true"
            aria-label="Ordenar empleados"
          >
            <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
            <span className="hidden xs:inline">Ordenar</span>
            {showSortOptions ? (
              <ChevronUp className="w-4 h-4 ml-1" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
            )}
          </motion.button>

          <AnimatePresence>
            {showSortOptions && (
              <motion.div
                variants={animationVariants.dropdown}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 z-10 overflow-hidden"
                role="menu"
                aria-label="Opciones de ordenamiento"
              >
                <div className="py-2">
                  {sortOptions.map((option) => (
                    <SortOptionItem
                      key={`${option.value}-${option.direction}`}
                      option={option}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Refresh Button */}
        <motion.button
          variants={animationVariants.button}
          whileHover="hover"
          whileTap="tap"
          onClick={refreshData}
          className={baseClasses.iconButton}
          disabled={isRefreshing}
          aria-label={
            isRefreshing ? "Actualizando datos..." : "Actualizar datos"
          }
        >
          <RefreshCw
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            aria-hidden="true"
          />
        </motion.button>

        {/* Filter Button (Placeholder) */}
        <motion.button
          variants={animationVariants.button}
          whileHover="hover"
          whileTap="tap"
          className={baseClasses.iconButton}
          aria-label="Filtrar empleados (próximamente)"
          title="Filtrar empleados (próximamente)"
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
