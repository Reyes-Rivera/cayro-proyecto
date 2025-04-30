"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Check,
  Building,
  Globe,
  AlertCircle,
  Map,
  X,
  ChevronRight,
  Loader2,
  Shield,
  Home,
  MapPinned,
  CheckCircle2,
  Mail,
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
  const addressListRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    clearErrors,
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
    // Scroll to top when canceling
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="p-6 md:p-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-md mr-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 rounded-full w-8 h-8 -top-4 -left-4 blur-md"></div>
              <MapPin className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Mis Direcciones
              </h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>Mi Cuenta</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Direcciones
                </span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddAddress}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 font-medium relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <Plus className="w-5 h-5" />
            <span>Añadir dirección</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 shadow-sm"
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 relative">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col items-center text-center mb-2">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {editingAddressId
                      ? "Editar dirección"
                      : "Añadir nueva dirección"}
                  </h2>
                  <p className="text-blue-100 mt-2 max-w-lg">
                    Completa los datos para{" "}
                    {editingAddressId ? "actualizar tu" : "guardar una nueva"}{" "}
                    dirección
                  </p>
                  <div className="h-1 w-24 bg-white/30 mt-4 rounded-full"></div>
                </div>
              </div>

              <div className="p-6 md:p-8 relative z-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* País */}
                    <div className="space-y-2">
                      <label
                        htmlFor="country"
                        className="flex items-center text-gray-700 text-sm font-medium"
                      >
                        <Globe className="w-4 h-4 mr-2 text-blue-600" />
                        País
                      </label>
                      <div className="relative group">
                        <select
                          id="country"
                          {...register("country", {
                            required: "El país es requerido",
                          })}
                          className="block w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none"
                        >
                          <option value="México">México</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <ChevronRight className="h-5 w-5 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Ciudad */}
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="flex items-center text-gray-700 text-sm font-medium"
                      >
                        <Building className="w-4 h-4 mr-2 text-blue-600" />
                        Ciudad
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          id="city"
                          placeholder="Ej. Monterrey"
                          {...register("city", {
                            required: "La ciudad es requerida",
                            pattern: {
                              value: specialCharsPattern,
                              message:
                                "No se permiten caracteres especiales como <, >, ', \" o `",
                            },
                            onChange: (e) => {
                              let value = e.target.value;
                              value = value.replace(/[<>='"]/g, "");
                              e.target.value = value;

                              if (value && specialCharsPattern.test(value)) {
                                clearErrors("city");
                              }
                            },
                          })}
                          className={`block w-full rounded-lg border ${
                            errors.city
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
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
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    {/* Estado */}
                    <div className="space-y-2">
                      <label
                        htmlFor="state"
                        className="flex items-center text-gray-700 text-sm font-medium"
                      >
                        <Map className="w-4 h-4 mr-2 text-blue-600" />
                        Estado
                      </label>
                      <div className="relative group">
                        <select
                          id="state"
                          {...register("state", {
                            required: "El estado es requerido",
                          })}
                          className={`block w-full rounded-lg border ${
                            errors.state
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none`}
                        >
                          <option value="">Seleccionar estado</option>
                          {states.map((state) => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                        {errors.state ? (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        ) : (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                            <ChevronRight className="h-5 w-5 rotate-90" />
                          </div>
                        )}
                      </div>
                      {errors.state && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.state.message}
                        </p>
                      )}
                    </div>

                    {/* Código postal */}
                    <div className="space-y-2">
                      <label
                        htmlFor="postalCode"
                        className="flex items-center text-gray-700 text-sm font-medium"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                        Código postal
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          id="postalCode"
                          placeholder="Ej. 64000"
                          {...register("postalCode", {
                            required: "El código postal es requerido",
                            pattern: {
                              value: /^\d{5}$/,
                              message: "El código postal debe tener 5 dígitos",
                            },
                            onChange: (e) => {
                              let value = e.target.value;
                              value = value.replace(/[^0-9]/g, "");
                              e.target.value = value;

                              if (/^\d{5}$/.test(value)) {
                                clearErrors("postalCode");
                              }
                            },
                          })}
                          className={`block w-full rounded-lg border ${
                            errors.postalCode
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                        />
                        {errors.postalCode ? (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        ) : (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      {errors.postalCode && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>

                    {/* Colonia */}
                    <div className="space-y-2">
                      <label
                        htmlFor="colony"
                        className="flex items-center text-gray-700 text-sm font-medium"
                      >
                        <Building className="w-4 h-4 mr-2 text-blue-600" />
                        Colonia
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          id="colony"
                          placeholder="Ej. Centro"
                          {...register("colony", {
                            required: "La colonia es requerida",
                            pattern: {
                              value: specialCharsPattern,
                              message:
                                "No se permiten caracteres especiales como <, >, ', \" o `",
                            },
                            onChange: (e) => {
                              let value = e.target.value;
                              value = value.replace(/[<>='"]/g, "");
                              e.target.value = value;

                              if (value && specialCharsPattern.test(value)) {
                                clearErrors("colony");
                              }
                            },
                          })}
                          className={`block w-full rounded-lg border ${
                            errors.colony
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                        />
                        {errors.colony && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.colony && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.colony.message}
                        </p>
                      )}
                    </div>

                    {/* Calle y número */}
                    <div className="space-y-2">
                      <label
                        htmlFor="street"
                        className="flex items-center text-gray-700 text-sm font-medium"
                      >
                        <Home className="w-4 h-4 mr-2 text-blue-600" />
                        Calle y número
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          id="street"
                          placeholder="Ej. Av. Constitución 123"
                          {...register("street", {
                            required: "La calle y número son requeridos",
                            pattern: {
                              value: specialCharsPattern,
                              message:
                                "No se permiten caracteres especiales como <, >, ', \" o `",
                            },
                            onChange: (e) => {
                              let value = e.target.value;
                              value = value.replace(/[<>='"]/g, "");
                              e.target.value = value;

                              if (value && specialCharsPattern.test(value)) {
                                clearErrors("street");
                              }
                            },
                          })}
                          className={`block w-full rounded-lg border ${
                            errors.street
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
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
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dirección predeterminada */}
                  <div className="flex items-center mt-4 bg-blue-50 border border-blue-100 text-blue-800 py-3 rounded-xl px-4">
                    <input
                      type="checkbox"
                      id="isDefault"
                      {...register("isDefault")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="isDefault"
                      className="ml-2 text-sm font-medium text-gray-700 flex items-center"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600" />
                      Establecer como dirección predeterminada
                    </label>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>
                            {editingAddressId
                              ? "Actualizando..."
                              : "Guardando..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          <span>Guardar dirección</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      <div id="address-list" ref={addressListRef}>
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <MapPinned className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
              Cargando direcciones...
            </p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address, i) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative w-full"
              >
                <div className="p-4 relative">
                  {/* Header with icon and title */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Dirección {i + 1}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                        aria-label="Editar dirección"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={isDeleting === address.id}
                        className="p-2 rounded-md hover:bg-gray-100 text-red-500 transition-colors"
                        aria-label="Eliminar dirección"
                      >
                        {isDeleting === address.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Address details */}
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <Home className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{address.street}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{address.colony}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">
                        {address.city}, {address.state}, {address.postalCode}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{address.country}</p>
                    </div>
                  </div>

                  {/* Default address checkbox */}
                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      id={`default-${address.id}`}
                      checked={address.isDefault}
                      onChange={() => handleSetDefaultAddress(address.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`default-${address.id}`}
                      className={`ml-2 text-sm font-medium ${
                        address.isDefault
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      } cursor-pointer transition-colors`}
                    >
                      Establecer como predeterminada
                    </label>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-lg mx-auto border border-gray-100 dark:border-gray-700 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-md relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse"></div>
              <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400 relative z-10" />
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
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/20 transition-all mx-auto relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
