"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Save,
  Edit,
  X,
  MapPin,
  Home,
  Building,
  Globe,
  MailIcon,
  AlertCircle,
  Loader2,
  Map,
  Navigation,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContextType";
import { getUserAddress, updateAddress } from "@/api/users";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { motion } from "framer-motion";

// Interfaz para la dirección como entidad separada
interface Address {
  id?: number;
  userId?: number;
  street: string;
  city: string;
  state: string; // Agregado campo de estado
  country: string;
  postalCode: string;
  colony: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interfaz para el formulario de dirección
interface AddressFormData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  colony: string;
}

export function AddressSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Configurar react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<AddressFormData>();

  // Observar el valor del país para actualizar las opciones de estado
  const selectedCountry = watch("country");

  // Cargar la dirección del usuario cuando el componente se monte
  useEffect(() => {
    const fetchAddress = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          // Obtener la dirección desde la API
          const addressData = await getUserAddress(Number(user.id));
          setAddress(addressData.data);

          // Establecer los valores por defecto en el formulario
          reset({
            street: addressData?.data?.street || "",
            city: addressData?.data?.city || "",
            state: addressData?.data?.state || "",
            country: addressData?.data?.country || "",
            postalCode: addressData?.data?.postalCode || "",
            colony: addressData?.data?.colony || "",
          });
        } catch (error) {
          console.error("Error al cargar la dirección:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAddress();
  }, [user, reset]);

  const toggleEditing = () => {
    if (isEditing) {
      // Restablecer el formulario si se cancela la edición
      reset({
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        country: address?.country || "",
        postalCode: address?.postalCode || "",
        colony: address?.colony || "",
      });
    }
    setIsEditing((prev) => !prev);
  };

  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      if (user?.id) {
        // Crear un objeto de dirección con los datos del formulario
        const updatedAddress: Address = {
          ...address,
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          colony: data.colony,
        };

        const res = await updateAddress(Number(user.id), updatedAddress);
        if (res) {
          // Actualizar el estado local con los nuevos datos
          setAddress(updatedAddress);

          Swal.fire({
            icon: "success",
            title: "Dirección actualizada",
            text: "Su información de dirección ha sido actualizada correctamente.",
            confirmButtonColor: "#3B82F6",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la información. Inténtelo de nuevo más tarde.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Patrón de validación para rechazar caracteres especiales
  const specialCharsPattern = /^[^<>'"`]*$/;

  // Obtener estados según el país seleccionado
  const getStatesByCountry = (country: string) => {
    switch (country) {
      case "MEX":
        return [
          { value: "AGS", label: "Aguascalientes" },
          { value: "BC", label: "Baja California" },
          { value: "BCS", label: "Baja California Sur" },
          { value: "CAMP", label: "Campeche" },
          { value: "CHIS", label: "Chiapas" },
          { value: "CHIH", label: "Chihuahua" },
          { value: "CDMX", label: "Ciudad de México" },
          { value: "COAH", label: "Coahuila" },
          { value: "COL", label: "Colima" },
          { value: "DGO", label: "Durango" },
          { value: "GTO", label: "Guanajuato" },
          { value: "GRO", label: "Guerrero" },
          { value: "HGO", label: "Hidalgo" },
          { value: "JAL", label: "Jalisco" },
          { value: "MEX", label: "Estado de México" },
          { value: "MICH", label: "Michoacán" },
          { value: "MOR", label: "Morelos" },
          { value: "NAY", label: "Nayarit" },
          { value: "NL", label: "Nuevo León" },
          { value: "OAX", label: "Oaxaca" },
          { value: "PUE", label: "Puebla" },
          { value: "QRO", label: "Querétaro" },
          { value: "QROO", label: "Quintana Roo" },
          { value: "SLP", label: "San Luis Potosí" },
          { value: "SIN", label: "Sinaloa" },
          { value: "SON", label: "Sonora" },
          { value: "TAB", label: "Tabasco" },
          { value: "TAMPS", label: "Tamaulipas" },
          { value: "TLAX", label: "Tlaxcala" },
          { value: "VER", label: "Veracruz" },
          { value: "YUC", label: "Yucatán" },
          { value: "ZAC", label: "Zacatecas" },
        ];
      default:
        return [{ value: "", label: "Seleccione un país primero" }];
    }
  };

  const states = getStatesByCountry(selectedCountry);

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
        {/* Tarjeta de imagen de dirección */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-5 text-white">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1 sm:gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Ubicación
            </h2>
          </div>

          <div className="p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center space-y-3 sm:space-y-4 md:space-y-6 relative z-10">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 shadow-lg">
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Navigation className="w-16 h-16 text-blue-500 dark:text-blue-400" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.name} {user?.surname}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {user?.email}
              </p>
              <div className="mt-4">
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                  Dirección Principal
                </span>
              </div>
            </div>

            {!isLoading && address && (
              <div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30 mt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {address.street}, {address.colony}, {address.city},{" "}
                      {address.state}, {address.country}, CP{" "}
                      {address.postalCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-blue-700 dark:text-blue-400">
                      Dirección verificada
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tarjeta de información de dirección */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-5 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1 sm:gap-2">
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">Información de Dirección</span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={toggleEditing}
                disabled={isSubmitting || isLoading}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-all ${
                  isEditing
                    ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                } ${
                  isSubmitting || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex justify-center items-center h-64 relative z-10">
              <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Cargando información de dirección...
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-3 sm:p-4 md:p-6 lg:p-8 relative z-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* País y Estado en la misma columna */}
                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                  >
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    País
                  </Label>
                  <div className="relative">
                    <select
                      id="country"
                      {...register("country", {
                        required: "El país es obligatorio",
                      })}
                      disabled={!isEditing || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      } transition-all duration-200 shadow-sm`}
                    >
                      <option value="">Seleccionar país</option>
                      <option value="MEX">México</option>
                    </select>
                    {errors.country && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.country && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                  >
                    <Map className="w-4 h-4 text-blue-500" />
                    Estado/Provincia
                  </Label>
                  <div className="relative">
                    <select
                      id="state"
                      {...register("state", {
                        required: "El estado es obligatorio",
                      })}
                      disabled={!isEditing || isSubmitting || !selectedCountry}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      } transition-all duration-200 shadow-sm`}
                    >
                      <option value="">Seleccionar estado</option>
                      {states.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.state && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* Código Postal y Ciudad en la misma columna */}
                <div className="space-y-2">
                  <Label
                    htmlFor="postalCode"
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                  >
                    <MailIcon className="w-4 h-4 text-blue-500" />
                    Código Postal
                  </Label>
                  <div className="relative">
                    <input
                      id="postalCode"
                      {...register("postalCode", {
                        required: "El código postal es obligatorio",
                        pattern: {
                          value: /^[0-9]{5}$/,
                          message:
                            "El código postal debe tener 5 dígitos numéricos",
                        },
                      })}
                      disabled={!isEditing || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      } transition-all duration-200 shadow-sm`}
                    />
                    {errors.postalCode && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.postalCode && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                  >
                    <Building className="w-4 h-4 text-blue-500" />
                    Ciudad
                  </Label>
                  <div className="relative">
                    <input
                      id="city"
                      {...register("city", {
                        required: "La ciudad es obligatoria",
                        minLength: {
                          value: 3,
                          message: "La ciudad debe tener al menos 3 caracteres",
                        },
                        maxLength: {
                          value: 50,
                          message:
                            "La ciudad no puede exceder los 50 caracteres",
                        },
                        pattern: {
                          value: specialCharsPattern,
                          message:
                            "No se permiten caracteres especiales como <, >, ', \" o `",
                        },
                      })}
                      disabled={!isEditing || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      } transition-all duration-200 shadow-sm`}
                    />
                    {errors.city && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.city && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* Colonia y Calle en la misma columna */}
                <div className="space-y-2">
                  <Label
                    htmlFor="colony"
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                  >
                    <Building className="w-4 h-4 text-blue-500" />
                    Colonia
                  </Label>
                  <div className="relative">
                    <input
                      id="colony"
                      {...register("colony", {
                        required: "La colonia es obligatoria",
                        minLength: {
                          value: 3,
                          message:
                            "La colonia debe tener al menos 3 caracteres",
                        },
                        maxLength: {
                          value: 50,
                          message:
                            "La colonia no puede exceder los 50 caracteres",
                        },
                        pattern: {
                          value: specialCharsPattern,
                          message:
                            "No se permiten caracteres especiales como <, >, ', \" o `",
                        },
                      })}
                      disabled={!isEditing || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      } transition-all duration-200 shadow-sm`}
                    />
                    {errors.colony && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.colony && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.colony.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="street"
                    className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                  >
                    <Home className="w-4 h-4 text-blue-500" />
                    Calle y Número
                  </Label>
                  <div className="relative">
                    <input
                      id="street"
                      {...register("street", {
                        required: "La calle es obligatoria",
                        minLength: {
                          value: 3,
                          message: "La calle debe tener al menos 3 caracteres",
                        },
                        maxLength: {
                          value: 100,
                          message:
                            "La calle no puede exceder los 100 caracteres",
                        },
                        pattern: {
                          value: specialCharsPattern,
                          message:
                            "No se permiten caracteres especiales como <, >, ', \" o `",
                        },
                      })}
                      disabled={!isEditing || isSubmitting}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isEditing
                          ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      } transition-all duration-200 shadow-sm`}
                      placeholder="Calle, número exterior e interior"
                    />
                    {errors.street && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.street && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.street.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-end mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span className="text-sm md:text-base">
                          Guardar Cambios
                        </span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
