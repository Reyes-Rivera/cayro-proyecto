"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  MapPin,
  Plus,
  Edit,
  Trash,
  Check,
  Building,
  Globe,
  AlertCircle,
  Map,
  X,
  ChevronRight,
  Loader2,
  Shield,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import {
  addAddressUser,
  deleteAddressUser,
  getUserAddresses,
  updateAddressUser,
} from "@/api/users";
import { useAuth } from "@/context/AuthContextType";

type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  colony: string;
  country: string;
  isDefault: boolean;
};

const AddressView = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Address>();

  useEffect(() => {
    const getUserAdderssesApi = async () => {
      try {
        setInitialLoading(true);
        const res = await getUserAddresses(Number(user?.id));
        setAddresses(res.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    getUserAdderssesApi();
  }, [user?.id]);

  const selectedCountry = watch("country");

  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setEditingAddressId(null);
    reset({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      colony: "",
      country: "México",
    });

    // Scroll to form
    setTimeout(() => {
      document
        .getElementById("address-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleEditAddress = (address: Address) => {
    setIsAddingAddress(false);
    setEditingAddressId(address.id);
    reset(address);

    // Scroll to form
    setTimeout(() => {
      document
        .getElementById("address-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleDeleteAddress = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "var(--background)",
      color: "var(--foreground)",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsDeleting(id);
          await deleteAddressUser(Number(user?.id), +id);
          Swal.fire({
            icon: "success",
            title: "¡Dirección eliminada!",
            toast: true,
            text: "Tu dirección ha sido eliminada correctamente.",
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
            animation: true,
            background: "#F0FDF4",
            color: "#166534",
            iconColor: "#22C55E",
          });
          setAddresses(addresses.filter((address) => address.id !== id));
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Error desconocido.";
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            toast: true,
            text: errorMessage,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
            animation: true,
            background: "#FEF2F2",
            color: "#B91C1C",
            iconColor: "#EF4444",
          });
        } finally {
          setIsDeleting(null);
        }
      }
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  };

  const onSubmit: SubmitHandler<Address> = async (data) => {
    try {
      setIsLoading(true);

      if (data.isDefault) {
        setAddresses(
          addresses.map((address) => ({
            ...address,
            isDefault: false,
          }))
        );
      }

      if (editingAddressId) {
        const newData = {
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          colony: data.colony,
          country: data.country,
        };
        await updateAddressUser(Number(user?.id), +data.id, newData);
        Swal.fire({
          icon: "success",
          title: "¡Dirección actualizada!",
          toast: true,
          text: "Tu dirección ha sido editada correctamente.",
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          animation: true,
          background: "#F0FDF4",
          color: "#166534",
          iconColor: "#22C55E",
        });
        setAddresses(
          addresses.map((address) =>
            address.id === editingAddressId ? { ...address, ...data } : address
          )
        );
        window.scrollTo(0, 0);
      } else {
        const newData = {
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          colony: data.colony,
          country: data.country,
        };
        await addAddressUser(Number(user?.id), newData);
        Swal.fire({
          icon: "success",
          title: "¡Dirección agregada!",
          toast: true,
          text: "Tu dirección ha sido agregada correctamente.",
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          animation: true,
          background: "#F0FDF4",
          color: "#166534",
          iconColor: "#22C55E",
        });
        const newAddress: Address = {
          ...data,
          id: Date.now().toString(),
        };
        setAddresses([...addresses, newAddress]);
        window.scrollTo(0, 0);
      }

      setIsAddingAddress(false);
      setEditingAddressId(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        toast: true,
        text: errorMessage,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        animation: true,
        background: "#FEF2F2",
        color: "#B91C1C",
        iconColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    reset();
  };

  const getStatesByCountry = (country: string) => {
    switch (country) {
      case "México":
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
  const specialCharsPattern = /^[^<>'"`]*$/;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-md mr-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Mis Direcciones
              </h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>Mi Cuenta</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-blue-600 dark:text-blue-400">
                  Direcciones
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddAddress}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md font-medium relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <Plus className="w-5 h-5" />
            <span>Añadir dirección</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
            <Shield className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <span>
              Las direcciones guardadas te permitirán completar tus compras más
              rápido y enviar productos a múltiples ubicaciones.
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* Address Form */}
      <AnimatePresence mode="wait">
        {(isAddingAddress || editingAddressId) && (
          <motion.div
            id="address-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg mr-3 shadow-md">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  {editingAddressId
                    ? "Editar dirección"
                    : "Añadir nueva dirección"}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-5 md:p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* País */}
                    <div className="space-y-2">
                      <label
                        htmlFor="country"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Globe className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        País
                      </label>
                      <div className="relative">
                        <select
                          id="country"
                          {...register("country", {
                            required: "El país es requerido",
                          })}
                          className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-colors focus:outline-none"
                        >
                          <option value="México">México</option>
                        </select>
                      </div>
                    </div>

                    {/* Ciudad */}
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Building className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Ciudad
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="city"
                          {...register("city", {
                            required: "La ciudad es requerida",
                            pattern: {
                              value: specialCharsPattern,
                              message:
                                "No se permiten caracteres especiales como <, >, ', \" o `",
                            },
                          })}
                          className={`block w-full rounded-xl border ${
                            errors.city
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.city && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.city && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                      <label
                        htmlFor="state"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Map className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Estado
                      </label>
                      <div className="relative">
                        <select
                          id="state"
                          {...register("state", {
                            required: "El estado es requerido",
                          })}
                          className={`block w-full rounded-xl border ${
                            errors.state
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-colors focus:outline-none`}
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
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.state.message}
                        </p>
                      )}
                    </div>

                    {/* Código postal */}
                    <div className="space-y-2">
                      <label
                        htmlFor="postalCode"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Código postal
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="postalCode"
                          {...register("postalCode", {
                            required: "El código postal es requerido",
                            pattern: {
                              value: /^\d{5}$/,
                              message: "El código postal debe tener 5 dígitos",
                            },
                          })}
                          className={`block w-full rounded-xl border ${
                            errors.postalCode
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.postalCode && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.postalCode && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    {/* Colonia */}
                    <div className="space-y-2">
                      <label
                        htmlFor="colony"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Building className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Colonia
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="colony"
                          {...register("colony", {
                            required: "La colonia es requerida",
                            pattern: {
                              value: specialCharsPattern,
                              message:
                                "No se permiten caracteres especiales como <, >, ', \" o `",
                            },
                          })}
                          className={`block w-full rounded-xl border ${
                            errors.colony
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.colony && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.colony && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.colony.message}
                        </p>
                      )}
                    </div>

                    {/* Calle y número */}
                    <div className="space-y-2">
                      <label
                        htmlFor="street"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Building className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Calle y número
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="street"
                          {...register("street", {
                            required: "La calle y número son requeridos",
                            pattern: {
                              value: specialCharsPattern,
                              message:
                                "No se permiten caracteres especiales como <, >, ', \" o `",
                            },
                          })}
                          className={`block w-full rounded-xl border ${
                            errors.street
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.street && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.street && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dirección predeterminada */}
                  <div className="flex items-center mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <input
                      type="checkbox"
                      id="isDefault"
                      {...register("isDefault")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="isDefault"
                      className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Establecer como dirección predeterminada
                    </label>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>
                            {editingAddressId
                              ? "Actualizando..."
                              : "Guardando..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Guardar dirección</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      <div id="address-list">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Cargando direcciones...
            </p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address, i) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border ${
                  address.isDefault
                    ? "border-blue-500 dark:border-blue-600 shadow-blue-100 dark:shadow-blue-900/20"
                    : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                } hover:shadow-lg transition-all duration-300`}
              >
                <div className="p-5 relative">
                  {address.isDefault && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                      Predeterminada
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800/50">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Dirección {i + 1}
                      </h3>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditAddress(address)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                        aria-label="Editar dirección"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={isDeleting === address.id}
                        className="p-2 bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        aria-label="Eliminar dirección"
                      >
                        {isDeleting === address.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-700 dark:text-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <p className="text-sm">{address.street}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <p className="text-sm">{address.colony}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <p className="text-sm">
                        {address.city}, {address.state}, {address.postalCode}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <p className="text-sm">{address.country}</p>
                    </div>
                  </div>

                  {!address.isDefault && (
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 hover:underline transition-all duration-300"
                    >
                      <Check className="w-4 h-4" />
                      Establecer como predeterminada
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center max-w-lg mx-auto"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tienes direcciones guardadas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Añade una dirección para agilizar tus compras futuras y facilitar
              el proceso de envío.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddAddress}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:from-blue-700 hover:to-blue-800 transition-colors mx-auto relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <Plus className="w-5 h-5" />
              <span>Añadir mi primera dirección</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddressView;
