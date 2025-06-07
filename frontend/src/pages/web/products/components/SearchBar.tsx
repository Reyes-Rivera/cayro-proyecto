"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { FormEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function QuickSearch({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value;

    // Actualizar el término de búsqueda
    setSearchTerm(searchValue);

    // Actualizar la URL con el parámetro de búsqueda
    const url = new URL(window.location.href);
    if (searchValue.trim()) {
      url.searchParams.set("search", searchValue);
    } else {
      url.searchParams.delete("search");
    }

    // Actualizar la URL sin recargar la página
    window.history.pushState({}, "", url.toString());
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="relative flex items-center w-full"
    >
      <input
        type="text"
        name="search"
        placeholder="Buscar productos..."
        className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
        defaultValue={searchTerm}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
    </motion.form>
  );
}
