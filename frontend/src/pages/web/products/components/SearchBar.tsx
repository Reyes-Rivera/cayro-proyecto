"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useState, type FormEvent } from "react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function QuickSearch({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchValue = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value;

    setSearchTerm(searchValue);

    const url = new URL(window.location.href);
    if (searchValue.trim()) {
      url.searchParams.set("search", searchValue);
    } else {
      url.searchParams.delete("search");
    }

    window.history.pushState({}, "", url.toString());
  };

  const clearSearch = () => {
    setLocalSearchTerm("");
    setSearchTerm("");

    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    window.history.pushState({}, "", url.toString());
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="relative flex items-center w-full"
    >
      <div className="relative w-full">
        <input
          type="text"
          name="search"
          placeholder="Buscar productos..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all shadow-sm hover:shadow-md"
        />

        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />

        {localSearchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.form>
  );
}
