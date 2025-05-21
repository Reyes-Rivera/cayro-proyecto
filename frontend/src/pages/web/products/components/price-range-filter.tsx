"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface PriceRangeFilterProps {
  priceRange: { min: number | null; max: number | null };
  setPriceRange: (range: { min: number | null; max: number | null }) => void;
  minPrice?: number;
  maxPrice?: number;
}

export default function PriceRangeFilter({
  priceRange,
  setPriceRange,
}: PriceRangeFilterProps) {
  // Local state for input values
  const [minValue, setMinValue] = useState<string>(
    priceRange.min !== null ? priceRange.min.toString() : ""
  );
  const [maxValue, setMaxValue] = useState<string>(
    priceRange.max !== null ? priceRange.max.toString() : ""
  );

  // Update local state when props change
  useEffect(() => {
    setMinValue(priceRange.min !== null ? priceRange.min.toString() : "");
    setMaxValue(priceRange.max !== null ? priceRange.max.toString() : "");
  }, [priceRange.min, priceRange.max]);

  // Handle min price input change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or numeric values only
    if (value === "" || /^\d+$/.test(value)) {
      setMinValue(value);
    }
  };

  // Handle max price input change
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or numeric values only
    if (value === "" || /^\d+$/.test(value)) {
      setMaxValue(value);
    }
  };

  // Apply price filter when form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert input values to numbers or null
    const min = minValue === "" ? null : Number(minValue);
    const max = maxValue === "" ? null : Number(maxValue);

    // Validate min is not greater than max
    if (min !== null && max !== null && min > max) {
      alert("El precio mínimo no puede ser mayor que el precio máximo");
      return;
    }

    // Update price range
    setPriceRange({ min, max });

    // Update URL parameters
    const url = new URL(window.location.href);

    if (min !== null) {
      url.searchParams.set("priceMin", min.toString());
      url.searchParams.set("precioMin", min.toString());
    } else {
      url.searchParams.delete("priceMin");
      url.searchParams.delete("precioMin");
    }

    if (max !== null) {
      url.searchParams.set("priceMax", max.toString());
      url.searchParams.set("precioMax", max.toString());
    } else {
      url.searchParams.delete("priceMax");
      url.searchParams.delete("precioMax");
    }

    window.history.pushState({}, "", url.toString());
  };

  // Clear price filter
  const handleClear = () => {
    setMinValue("");
    setMaxValue("");
    setPriceRange({ min: null, max: null });

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.delete("priceMin");
    url.searchParams.delete("precioMin");
    url.searchParams.delete("priceMax");
    url.searchParams.delete("precioMax");
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="mb-12">
      <h4 className="font-medium text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center">
        <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
        Rango de Precio
      </h4>

      <form onSubmit={handleSubmit} className="px-2">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <div className="w-full">
              <label
                htmlFor="min-price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Precio Mínimo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="text"
                  id="min-price"
                  value={minValue}
                  onChange={handleMinChange}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full">
              <label
                htmlFor="max-price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Precio Máximo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="text"
                  id="max-price"
                  value={maxValue}
                  onChange={handleMaxChange}
                  placeholder="1000"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Aplicar
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
