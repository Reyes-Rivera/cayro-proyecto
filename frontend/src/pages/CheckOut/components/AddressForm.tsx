"use client";

import type React from "react";
import type { Direction, FormErrors } from "@/types/checkout";
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Check,
  Globe,
  Home,
  Info,
  Loader2,
  X,
} from "lucide-react";

interface AddressFormProps {
  newAddress: Direction;
  errors: FormErrors;
  isAddingAddress: boolean;
  isSavingAddress: boolean;
  addresses: Direction[];
  handleAddressInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSaveAddress: (e: React.FormEvent) => Promise<void>;
  handleCancelAddressForm: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  newAddress,
  errors,
  isAddingAddress,
  isSavingAddress,
  addresses,
  handleAddressInputChange,
  handleSaveAddress,
  handleCancelAddressForm,
}) => {
  return (
    <div
      id="address-form"
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          {isAddingAddress ? "Nueva dirección" : "Editar dirección"}
        </h3>
        {addresses.length > 0 && (
          <button
            type="button"
            onClick={handleCancelAddressForm}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calle */}
        <div className="space-y-2">
          <label
            htmlFor="street"
            className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            <Home className="w-4 h-4 mr-2 text-blue-600" />
            Calle y número
          </label>
          <div className="relative group">
            <input
              type="text"
              id="street"
              name="street"
              placeholder="Ej. Av. Constitución 123"
              value={newAddress.street}
              onChange={handleAddressInputChange}
              className={`block w-full rounded-lg border ${
                errors.street
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
            />
            {errors.street && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.street && (
            <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.street}
            </p>
          )}
        </div>

        {/* Colonia/Barrio */}
        <div className="space-y-2">
          <label
            htmlFor="neighborhood"
            className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            <Building className="w-4 h-4 mr-2 text-blue-600" />
            Colonia
          </label>
          <div className="relative group">
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              placeholder="Ej. Centro"
              value={newAddress.neighborhood}
              onChange={handleAddressInputChange}
              className={`block w-full rounded-lg border ${
                errors.neighborhood
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
            />
            {errors.neighborhood && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.neighborhood && (
            <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.neighborhood}
            </p>
          )}
        </div>

        {/* Ciudad */}
        <div className="space-y-2">
          <label
            htmlFor="city"
            className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            <Building className="w-4 h-4 mr-2 text-blue-600" />
            Ciudad
          </label>
          <div className="relative group">
            <input
              type="text"
              id="city"
              name="city"
              placeholder="Ej. Monterrey"
              value={newAddress.city}
              onChange={handleAddressInputChange}
              className={`block w-full rounded-lg border ${
                errors.city
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
            />
            {errors.city && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.city && (
            <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              {errors.city}
            </p>
          )}
        </div>

        {/* País */}
        <div className="space-y-2">
          <label
            htmlFor="country"
            className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            <Globe className="w-4 h-4 mr-2 text-blue-600" />
            País
          </label>
          <div className="relative group">
            <select
              id="country"
              name="country"
              value={newAddress.country}
              onChange={handleAddressInputChange}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none"
            >
              <option value="México">México</option>
              <option value="España">España</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Colombia">Colombia</option>
              <option value="Argentina">Argentina</option>
              <option value="Chile">Chile</option>
              <option value="Perú">Perú</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Referencias */}
        <div className="md:col-span-2 space-y-2">
          <label
            htmlFor="references"
            className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
          >
            <Info className="w-4 h-4 mr-2 text-blue-600" />
            Referencias (opcional)
          </label>
          <div className="relative group">
            <textarea
              id="references"
              name="references"
              placeholder="Ej. Casa blanca con rejas negras, frente a la farmacia"
              value={newAddress.references}
              onChange={handleAddressInputChange}
              rows={2}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400"
            />
          </div>
        </div>
      </div>

      {(isAddingAddress || !newAddress.isDefault) && (
        <div className="flex items-center mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-800 dark:text-blue-300 py-3 rounded-xl px-4">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={newAddress.isDefault}
            onChange={(e) =>
              handleAddressInputChange({
                ...e,
                target: {
                  ...e.target,
                  name: "isDefault",
                  value: e.target.checked.toString(),
                  type: "checkbox",
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="isDefault"
            className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-500" />
            Establecer como dirección predeterminada
          </label>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        {addresses.length > 0 && (
          <button
            type="button"
            onClick={handleCancelAddressForm}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={handleSaveAddress}
          disabled={isSavingAddress}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium flex items-center disabled:opacity-70"
        >
          {isSavingAddress ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isAddingAddress ? "Guardando..." : "Actualizando..."}
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {isAddingAddress ? "Guardar dirección" : "Actualizar dirección"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
