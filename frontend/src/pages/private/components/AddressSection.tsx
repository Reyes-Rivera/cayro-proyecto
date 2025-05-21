"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Save,
  Edit2,
  X,
  MapPin,
  Home,
  Building,
  Globe,
  MailIcon,
  Loader2,
  Map,
  Navigation,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
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
  state: string;
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
    <div className="px-6 space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {isEditing ? (
          // MODO EDICIÓN
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Encabezado para modo edición */}
            <div className="relative">
              <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
                <button
                  onClick={toggleEditing}
                  className="absolute top-6 left-6 bg-white text-blue-600 p-2 rounded-full transition-colors shadow-sm hover:bg-blue-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-center text-white pt-2">
                  <div className="inline-flex bg-white/20 p-3 rounded-full mb-3">
                    <Edit2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Editar Dirección</h2>
                  <p className="mt-1 text-white/80 flex items-center justify-center">
                    <Navigation className="w-3.5 h-3.5 mr-1.5 inline" />
                    Actualiza tu información de ubicación
                  </p>
                </div>
              </div>
              <div className="h-5"></div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              <div className="space-y-8">
                {/* Sección de ubicación */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    Ubicación
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* País */}
                    <div className="space-y-2">
                      <label
                        htmlFor="country"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        País
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="country"
                          {...register("country", {
                            required: "El país es obligatorio",
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border ${
                            errors.country
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 pl-10 shadow-sm transition-colors focus:outline-none`}
                        >
                          <option value="">Seleccionar país</option>
                          <option value="MEX">México</option>
                        </select>
                        {errors.country && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.country && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                      <label
                        htmlFor="state"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Estado
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Map className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="state"
                          {...register("state", {
                            required: "El estado es obligatorio",
                          })}
                          disabled={isSubmitting || !selectedCountry}
                          className={`block w-full rounded-lg border ${
                            errors.state
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 pl-10 shadow-sm transition-colors focus:outline-none`}
                        >
                          <option value="">Seleccionar estado</option>
                          {states.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                        {errors.state && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.state && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.state.message}
                        </p>
                      )}
                    </div>

                    {/* Ciudad */}
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Ciudad
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="city"
                          placeholder="Ingresa tu ciudad"
                          {...register("city", {
                            required: "La ciudad es obligatoria",
                            minLength: {
                              value: 3,
                              message:
                                "La ciudad debe tener al menos 3 caracteres",
                            },
                            pattern: {
                              value: specialCharsPattern,
                              message: "No se permiten caracteres especiales",
                            },
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border ${
                            errors.city
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 pl-10 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.city && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.city && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    {/* Código Postal */}
                    <div className="space-y-2">
                      <label
                        htmlFor="postalCode"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Código Postal
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="postalCode"
                          placeholder="12345"
                          {...register("postalCode", {
                            required: "El código postal es obligatorio",
                            pattern: {
                              value: /^[0-9]{5}$/,
                              message: "El código postal debe tener 5 dígitos",
                            },
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border ${
                            errors.postalCode
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 pl-10 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.postalCode && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.postalCode && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Sección de detalles */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-blue-500" />
                    Detalles de la Dirección
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonia */}
                    <div className="space-y-2">
                      <label
                        htmlFor="colony"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Colonia
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="colony"
                          placeholder="Ingresa tu colonia"
                          {...register("colony", {
                            required: "La colonia es obligatoria",
                            minLength: {
                              value: 3,
                              message:
                                "La colonia debe tener al menos 3 caracteres",
                            },
                            pattern: {
                              value: specialCharsPattern,
                              message: "No se permiten caracteres especiales",
                            },
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border ${
                            errors.colony
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 pl-10 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.colony && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.colony && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.colony.message}
                        </p>
                      )}
                    </div>

                    {/* Calle */}
                    <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="street"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Calle y Número
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Home className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="street"
                          placeholder="Calle, número exterior e interior"
                          {...register("street", {
                            required: "La calle es obligatoria",
                            minLength: {
                              value: 3,
                              message:
                                "La calle debe tener al menos 3 caracteres",
                            },
                            pattern: {
                              value: specialCharsPattern,
                              message: "No se permiten caracteres especiales",
                            },
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border ${
                            errors.street
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 pl-10 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.street && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.street && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Botones de acción */}
                <motion.div
                  variants={itemVariants}
                  className="pt-6 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    type="button"
                    onClick={toggleEditing}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover: dark:hover:bg-gray-700 focus:outline-none transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white focus:outline-none transition-colors shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        <span>Guardar cambios</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </form>
          </div>
        ) : (
          // MODO VISUALIZACIÓN
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Encabezado */}
            <div className="relative">
              <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-3 rounded-full mr-4">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Dirección
                      </h2>
                      <p className="mt-1 text-white/80 flex items-center">
                        <Navigation className="w-3.5 h-3.5 mr-1.5 inline" />
                        Información de ubicación
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleEditing}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
                    disabled={isLoading}
                  >
                    <Edit2 className="w-4 h-4 mr-1.5" />
                    Editar
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span className="text-sm font-medium">
                    Dirección verificada
                  </span>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Cargando información de dirección...
                    </p>
                  </div>
                </div>
              ) : address ? (
                <motion.div variants={containerVariants} className="space-y-8">
                  {/* Tarjeta principal de dirección */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row gap-6 items-start"
                  >
                    <div className="w-full md:w-1/3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md mb-4">
                          <Navigation className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          Dirección Principal
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                          Esta es tu dirección registrada para envíos y
                          correspondencia
                        </p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Verificada
                        </span>
                      </div>
                    </div>

                    <div className="w-full md:w-2/3 space-y-6">
                      {/* Detalles de la dirección */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700  dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 shadow-sm">
                              <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Calle y Número
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.street}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700  dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 shadow-sm">
                              <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Colonia
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.colony}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700  dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3 shadow-sm">
                              <Building className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Ciudad
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.city}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700  dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 shadow-sm">
                              <Map className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Estado
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.state}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700  dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3 shadow-sm">
                              <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                País
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.country === "MEX"
                                  ? "México"
                                  : address.country}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700  dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-3 shadow-sm">
                              <MailIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Código Postal
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.postalCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Estado de verificación */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between p-4  dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4 shadow-sm">
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Estado de la dirección
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white text-lg">
                            Verificada
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 mr-3">
                          Activa
                        </span>
                        <a
                          href="#"
                          className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
                        >
                          Detalles
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="flex flex-col items-center justify-center p-8"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
                    <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No hay dirección registrada
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                    Añade una dirección para facilitar la entrega de documentos
                    y correspondencia.
                  </p>
                  <button
                    onClick={toggleEditing}
                    className="inline-flex items-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Agregar dirección
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
