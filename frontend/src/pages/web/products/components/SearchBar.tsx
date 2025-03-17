"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { FormEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value;
    setSearchTerm(searchValue);
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="relative flex items-center w-full md:w-auto"
    >
      <input
        type="text"
        name="search"
        placeholder="Buscar productos..."
        className="pl-10 pr-14 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
        defaultValue={searchTerm}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <button
        type="submit"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
        aria-label="Buscar"
      >
        <Search className="h-4 w-4" />
      </button>
    </motion.form>
  );
}
