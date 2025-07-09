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
import {
  addAddressUser,
  deleteAddressUser,
  getUserAddresses,
  setDefaultAddressUser,
  updateAddressUser,
} from "@/api/users";
import { useAuth } from "@/context/AuthContextType";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

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

export default function AddressView() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
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
    const timer = setTimeout(() => {
      setPageLoading(false);
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getUserAdderssesApi = async () => {
      try {
        setInitialLoading(true);
        const res = await getUserAddresses(Number(user?.id));
        setAddresses(res.data);
      } catch (error: any) {
        AlertHelper.error({
          title: "Error al cargar las direcciones",
          message:
            error?.response?.data?.message ||
            "No se pudieron cargar las direcciones. Inténtelo más tarde.",
          timer: 4000,
          animation: "slideIn",
        });
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
    setTimeout(() => {
      document
        .getElementById("address-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmed = await AlertHelper.confirm({
      title: "¿Estás seguro?",
      message: "Esta acción no se puede revertir",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "warning",
      animation: "bounce",
    });

    if (!confirmed) return;

    try {
      setIsDeleting(id);

      await deleteAddressUser(Number(user?.id), +id);

      AlertHelper.success({
        title: "¡Dirección eliminada!",
        message: "Tu dirección ha sido eliminada correctamente.",
        timer: 3000,
        animation: "slideIn",
      });

      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";

      AlertHelper.error({
        title: "Error al eliminar",
        message: errorMessage,
        timer: 3000,
        animation: "slideIn",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      setIsSettingDefault(id); // Start loading animation for this address
      if (user?.id) {
        const res = await setDefaultAddressUser(+user?.id, +id);
        if (res) {
          setAddresses(
            addresses.map((address) => ({
              ...address,

              isDefault: address.id === id,
            }))
          );
          AlertHelper.success({
            title: "¡Dirección establecida!",
            message: "Tu dirección ha sido establecida correctamente.",
            timer: 3000,
            animation: "slideIn",
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      AlertHelper.error({
        title: "Error al establecer dirección.",
        message: errorMessage,
        timer: 3000,
        animation: "slideIn",
      });
    } finally {
      setIsSettingDefault(null); // Stop loading animation
    }
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
          isDefault: data.isDefault,
        };
        await updateAddressUser(Number(user?.id), +data.id, newData);
        AlertHelper.success({
          title: "¡Dirección actualizada!",
          message: "Tu dirección ha sido editada correctamente.",
          timer: 3000,
          animation: "slideIn",
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
          isDefault: data.isDefault,
        };

        await addAddressUser(Number(user?.id), newData);
        AlertHelper.success({
          title: "¡Dirección agregada!",
          message: "Tu dirección ha sido agregada correctamente.",
          timer: 3000,
          animation: "slideIn",
        });
        if (data.isDefault) {
          setAddresses(
            addresses.map((address) => ({
              ...address,
              isDefault: false,
            }))
          );
        }

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
      AlertHelper.error({
        title: "Error al guardar",
        message: errorMessage,
        timer: 3000,
        animation: "slideIn",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    reset();
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
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && <Loader />}
      {!pageLoading && (
        <div className="p-6 md:p-8">
          {/* Header */}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-gray-800 px-4 py-1.5">
                <MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />

                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  MIS DIRECCIONES
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Direcciones de{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-400">
                    Envío
                  </span>

                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
                </span>
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Gestiona tus direcciones para envíos y facturación
              </p>
            </div>

            <Button
              onClick={handleAddAddress}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Plus className="w-4 h-4" />

              <span>Añadir dirección</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg p-4 shadow-sm mb-8"
          >
            <p className="text-sm text-blue-800 dark:text-blue-100 flex items-start">
              <Shield className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />

              <span>
                Las direcciones guardadas te permitirán completar tus compras
                más rápido y enviar productos a múltiples ubicaciones.
              </span>
            </p>
          </motion.div>

          {/* Address Form */}

          <AnimatePresence>
            {(isAddingAddress || editingAddressId) && (
              <motion.div
                id="address-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-10"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden relative">
                  {/* Form Header */}

                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-6 text-white relative overflow-hidden">
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
                        {editingAddressId
                          ? "actualizar tu"
                          : "guardar una nueva"}{" "}
                        dirección
                      </p>

                      <div className="h-1 w-24 bg-white/30 mt-4 rounded-full"></div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 relative z-10">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
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
                              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none"
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

                                  if (
                                    value &&
                                    specialCharsPattern.test(value)
                                  ) {
                                    clearErrors("city");
                                  }
                                },
                              })}
                              className={`block w-full rounded-lg border ${
                                errors.city
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-300 focus:border-blue-300"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
                            />

                            {errors.city && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>

                          {errors.city && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
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
                              className={`block w-full rounded-lg border appearance-none ${
                                errors.state
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-300 focus:border-blue-300"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
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
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            ) : (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                <ChevronRight className="h-5 w-5 rotate-90" />
                              </div>
                            )}
                          </div>

                          {errors.state && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
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

                                  message:
                                    "El código postal debe tener 5 dígitos",
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
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-300 focus:border-blue-300"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
                            />

                            {errors.postalCode ? (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            ) : (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {errors.postalCode && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
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

                                  if (
                                    value &&
                                    specialCharsPattern.test(value)
                                  ) {
                                    clearErrors("colony");
                                  }
                                },
                              })}
                              className={`block w-full rounded-lg border ${
                                errors.colony
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-300 focus:border-blue-300"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
                            />

                            {errors.colony && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>

                          {errors.colony && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
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

                                  if (
                                    value &&
                                    specialCharsPattern.test(value)
                                  ) {
                                    clearErrors("street");
                                  }
                                },
                              })}
                              className={`block w-full rounded-lg border ${
                                errors.street
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-300 focus:border-blue-300"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300`}
                            />

                            {errors.street && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>

                          {errors.street && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />

                              {errors.street.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Dirección predeterminada */}

                      <div className="flex items-center mt-4 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 text-blue-800 dark:text-blue-100 py-3 rounded-lg px-4">
                        <input
                          type="checkbox"
                          id="isDefault"
                          {...register("isDefault")}
                          className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                        />

                        <label
                          htmlFor="isDefault"
                          className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                          Establecer como dirección predeterminada
                        </label>
                      </div>

                      {/* Botones de acción */}

                      <Separator className="my-6" />

                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          onClick={handleCancel}
                          variant="outline"
                          className="gap-2 bg-transparent"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />

                              <span>
                                {editingAddressId
                                  ? "Actualizando..."
                                  : "Guardando..."}
                              </span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />

                              <span>Guardar dirección</span>
                            </>
                          )}
                        </Button>
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
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>

                  <MapPinned className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>

                <p className="text-blue-500 mt-4 font-medium">
                  Cargando direcciones...
                </p>
              </div>
            ) : addresses.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {addresses.map((address, i) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-blue-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 relative w-full"
                  >
                    <div className="p-4 relative">
                      {/* Header with icon and title */}

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-gray-800 rounded-full p-2 w-10 h-10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>

                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              Dirección {i + 1}
                            </h3>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                            aria-label="Editar dirección"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={isDeleting === address.id}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 transition-colors"
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

                      <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <Home className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />

                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {address.street}
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <Building className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />

                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {address.colony}
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />

                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {address.city}, {address.state},{" "}
                            {address.postalCode}
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />

                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {address.country}
                          </p>
                        </div>
                      </div>

                      {/* Default address checkbox with loading animation */}
                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          id={`default-${address.id}`}
                          checked={address.isDefault}
                          onChange={() => handleSetDefaultAddress(address.id)}
                          disabled={isSettingDefault === address.id}
                          className={`w-4 h-4 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 ${
                            isSettingDefault === address.id ? "opacity-50" : ""
                          }`}
                        />
                        <label
                          htmlFor={`default-${address.id}`}
                          className={`ml-2 text-sm font-medium ${
                            address.isDefault
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                          } cursor-pointer transition-colors ${
                            isSettingDefault === address.id ? "opacity-50" : ""
                          }`}
                        >
                          {isSettingDefault === address.id ? (
                            <span className="flex items-center">
                              <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-blue-600 dark:text-blue-400" />
                              Estableciendo...
                            </span>
                          ) : (
                            "Establecer como predeterminada"
                          )}
                        </label>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center max-w-lg mx-auto border border-blue-100 dark:border-gray-700 relative overflow-hidden"
              >
                {/* Decorative elements */}

                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none"></div>

                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-md relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-500/5 animate-pulse"></div>

                  <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400 relative z-10" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tienes direcciones guardadas
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Añade una dirección para agilizar tus compras futuras y
                  facilitar el proceso de envío.
                </p>

                <Button
                  onClick={handleAddAddress}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />

                  <span>Añadir mi primera dirección</span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
