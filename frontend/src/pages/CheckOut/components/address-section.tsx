"use client";
import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  MapPin,
  User,
  Home,
  Building,
  Info,
  Globe,
  AlertCircle,
  X,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Check,
  ChevronDown,
  ArrowRight,
  Navigation,
  ArrowLeft,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  getUserAddresses,
  addAddressUser,
  updateAddressUser,
  deleteAddressUser,
  setDefaultAddressUser,
} from "@/api/users";
import type {
  Direction,
  AddressFormData,
  ShippingDetailsFormData,
} from "@/types/checkout";

interface AddressSectionProps {
  user: any;
  onAddressSelected: (shippingDetails: ShippingDetailsFormData) => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  addresses: Direction[];
  setAddresses: (addresses: Direction[]) => void;
}

export default function AddressSection({
  user,
  onAddressSelected,
  selectedAddressId,
  setSelectedAddressId,
  addresses,
  setAddresses,
}: AddressSectionProps) {
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Address form state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(false);

  // React Hook Form setup for address
  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors },
    reset: resetAddress,
    watch: watchAddress,
  } = useForm<AddressFormData>({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      country: "México",
      postalCode: "",
      colony: "",
      references: "",
      isDefault: false,
    },
    mode: "onChange",
  });

  // React Hook Form setup for shipping details
  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: shippingErrors },
  } = useForm<ShippingDetailsFormData>({
    defaultValues: {
      references: "",
      betweenStreetOne: "",
      betweenStreetTwo: "",
    },
    mode: "onChange",
  });

  // Validation rules for address
  const addressValidationRules = {
    street: {
      required: "La dirección es requerida",
      minLength: {
        value: 5,
        message: "La dirección debe tener al menos 5 caracteres",
      },
      maxLength: {
        value: 100,
        message: "La dirección no puede exceder 100 caracteres",
      },
    },
    city: {
      required: "La ciudad es requerida",
      minLength: {
        value: 2,
        message: "La ciudad debe tener al menos 2 caracteres",
      },
      maxLength: {
        value: 50,
        message: "La ciudad no puede exceder 50 caracteres",
      },
    },
    state: {
      required: "El estado es requerido",
      minLength: {
        value: 2,
        message: "El estado debe tener al menos 2 caracteres",
      },
      maxLength: {
        value: 50,
        message: "El estado no puede exceder 50 caracteres",
      },
    },
    country: {
      required: "El país es requerido",
    },
    postalCode: {
      required: "El código postal es requerido",
      pattern: {
        value: /^[0-9]{5}$/,
        message: "El código postal debe tener 5 dígitos",
      },
    },
    colony: {
      required: "La colonia es requerida",
      minLength: {
        value: 2,
        message: "La colonia debe tener al menos 2 caracteres",
      },
      maxLength: {
        value: 50,
        message: "La colonia no puede exceder 50 caracteres",
      },
    },
    references: {
      maxLength: {
        value: 200,
        message: "Las referencias no pueden exceder 200 caracteres",
      },
    },
  };

  // Validation rules for shipping details
  const shippingValidationRules = {
    references: {
      required: "Las referencias de entrega son requeridas",
      minLength: {
        value: 10,
        message: "Las referencias deben tener al menos 10 caracteres",
      },
      maxLength: {
        value: 255,
        message: "Las referencias no pueden exceder 255 caracteres",
      },
    },
    betweenStreetOne: {
      required: "La primera calle de referencia es requerida",
      minLength: {
        value: 3,
        message: "Debe tener al menos 3 caracteres",
      },
      maxLength: {
        value: 100,
        message: "No puede exceder 100 caracteres",
      },
    },
    betweenStreetTwo: {
      required: "La segunda calle de referencia es requerida",
      minLength: {
        value: 3,
        message: "Debe tener al menos 3 caracteres",
      },
      maxLength: {
        value: 100,
        message: "No puede exceder 100 caracteres",
      },
    },
  };

  // Load user addresses from API
  useEffect(() => {
    const loadUserAddresses = async () => {
      if (!user || !user.id) {
        setIsLoadingAddresses(false);
        return;
      }

      try {
        setIsLoadingAddresses(true);
        setAddressError(null);

        console.log("Loading addresses for user:", user.id);
        const response = await getUserAddresses(Number(user.id));
        console.log("Addresses response:", response.data);

        const userAddresses = response.data || [];

        // Transform the addresses to match our interface
        const transformedAddresses: Direction[] = userAddresses.map(
          (addr: any) => ({
            id: addr.id,
            street: addr.street,
            city: addr.city,
            state: addr.state || "",
            country: addr.country,
            postalCode: addr.postalCode || "",
            colony: addr.colony,
            neighborhood: addr.colony,
            references: addr.references || "",
            isDefault: addr.isDefault,
            userAddressId: addr.userAddressId,
          })
        );

        setAddresses(transformedAddresses);

        // Set default selected address
        const defaultAddress = transformedAddresses.find(
          (addr: Direction) => addr.isDefault
        );
        if (defaultAddress && defaultAddress.id) {
          setSelectedAddressId(defaultAddress.id.toString());
        } else if (
          transformedAddresses.length > 0 &&
          transformedAddresses[0].id
        ) {
          setSelectedAddressId(transformedAddresses[0].id.toString());
        } else {
          setIsAddressFormVisible(true);
        }
      } catch (error) {
        console.error("Error loading user addresses:", error);
        setAddressError(
          "No se pudieron cargar las direcciones. Por favor, inténtalo de nuevo."
        );
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    loadUserAddresses();
  }, [user, setAddresses, setSelectedAddressId]);

  // Handle adding a new address
  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setEditingAddressId(null);
    setIsAddressFormVisible(true);
    setShowShippingDetails(false);

    resetAddress({
      street: "",
      city: "",
      state: "",
      country: "México",
      postalCode: "",
      colony: "",
      references: "",
      isDefault: false,
    });

    setTimeout(() => {
      document
        .getElementById("address-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Handle editing an address
  const handleEditAddress = (address: Direction) => {
    if (!address.id) return;

    setIsAddingAddress(false);
    setEditingAddressId(address.id.toString());
    setIsAddressFormVisible(true);
    setShowShippingDetails(false);

    resetAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      colony: address.colony,
      references: address.references,
      isDefault: address.isDefault,
    });

    setTimeout(() => {
      document
        .getElementById("address-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Handle deleting an address
  const handleDeleteAddress = (id: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const numericId = Number.parseInt(id);
          setIsDeleting(id);

          if (user && user.id) {
            const addressToDelete = addresses.find(
              (addr) => addr.id === numericId
            );
            if (addressToDelete && addressToDelete.userAddressId) {
              await deleteAddressUser(
                Number(user.id),
                addressToDelete.userAddressId
              );
            } else {
              await deleteAddressUser(Number(user.id), numericId);
            }
          }

          const updatedAddresses = addresses.filter(
            (addr) => addr.id !== numericId
          );
          setAddresses(updatedAddresses);

          if (selectedAddressId === id) {
            const defaultAddress = updatedAddresses.find(
              (addr) => addr.isDefault
            );
            if (defaultAddress && defaultAddress.id) {
              setSelectedAddressId(defaultAddress.id.toString());
            } else if (updatedAddresses.length > 0) {
              const newSelectedId = updatedAddresses[0]?.id;
              if (newSelectedId) setSelectedAddressId(newSelectedId.toString());
            } else {
              setSelectedAddressId(null);
              setIsAddressFormVisible(true);
            }
          }

          Swal.fire({
            title: "¡Eliminada!",
            text: "La dirección ha sido eliminada.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting address:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la dirección. Por favor, inténtalo de nuevo.",
            icon: "error",
          });
        } finally {
          setIsDeleting(null);
        }
      }
    });
  };

  // Handle setting default address
  const handleSetDefaultAddress = async (id: string) => {
    try {
      const numericId = Number.parseInt(id);
      const addressToUpdate = addresses.find((addr) => addr.id === numericId);

      if (user && user.id && addressToUpdate) {
        if (addressToUpdate.userAddressId) {
          await setDefaultAddressUser(
            Number(user.id),
            addressToUpdate.userAddressId
          );
        } else {
          await setDefaultAddressUser(Number(user.id), numericId);
        }
      }

      const updatedAddresses = addresses.map((address) => ({
        ...address,
        isDefault: address.id === numericId,
      }));

      setAddresses(updatedAddresses);
      setSelectedAddressId(id);

      Swal.fire({
        icon: "success",
        title: "¡Dirección predeterminada actualizada!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error setting default address:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la dirección predeterminada. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
    }
  };

  // Handle address form submission
  const onSubmitAddress: SubmitHandler<AddressFormData> = async (data) => {
    try {
      setIsSavingAddress(true);

      const addressData = {
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        colony: data.colony,
        isDefault: data.isDefault || addresses.length === 0,
      };

      if (editingAddressId && user && user.id) {
        // Editing existing address
        const editingIdNumber = Number.parseInt(editingAddressId);
        const addressToEdit = addresses.find(
          (addr) => addr.id === editingIdNumber
        );

        if (addressToEdit && addressToEdit.userAddressId) {
          await updateAddressUser(
            Number(user.id),
            addressToEdit.userAddressId,
            addressData
          );
        } else {
          await updateAddressUser(
            Number(user.id),
            editingIdNumber,
            addressData
          );
        }

        const updatedAddress: Direction = {
          id: editingIdNumber,
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          colony: data.colony,
          neighborhood: data.colony,
          references: data.references,
          isDefault: data.isDefault,
          userAddressId: addressToEdit?.userAddressId,
        };

        const updatedAddresses = addresses.map((addr) =>
          addr.id === editingIdNumber ? updatedAddress : addr
        );
        setAddresses(updatedAddresses);

        if (data.isDefault) {
          const finalAddresses = updatedAddresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === editingIdNumber,
          }));
          setAddresses(finalAddresses);
          setSelectedAddressId(editingAddressId);
        }

        Swal.fire({
          icon: "success",
          title: "¡Dirección actualizada!",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      } else if (user && user.id) {
        // Adding new address
        const response = await addAddressUser(Number(user.id), addressData);
        const addedAddress = response.data;

        const transformedAddress: Direction = {
          id: addedAddress.address?.id || addedAddress.id,
          street: addedAddress.address?.street || addressData.street,
          city: addedAddress.address?.city || addressData.city,
          state: addedAddress.address?.state || addressData.state,
          country: addedAddress.address?.country || addressData.country,
          postalCode:
            addedAddress.address?.postalCode || addressData.postalCode,
          colony: addedAddress.address?.colony || addressData.colony,
          neighborhood: addedAddress.address?.colony || addressData.colony,
          references: data.references,
          isDefault: addedAddress.isDefault || addressData.isDefault,
          userAddressId: addedAddress.userAddressId,
        };

        if (addressData.isDefault) {
          const updatedAddresses = [
            ...addresses.map((addr) => ({ ...addr, isDefault: false })),
            transformedAddress,
          ];
          setAddresses(updatedAddresses);
          setSelectedAddressId(transformedAddress.id.toString());
        } else {
          const updatedAddresses = [...addresses, transformedAddress];
          setAddresses(updatedAddresses);
          if (!selectedAddressId) {
            setSelectedAddressId(transformedAddress.id.toString());
          }
        }

        Swal.fire({
          icon: "success",
          title: "¡Dirección agregada!",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      }

      setIsAddressFormVisible(false);
      setIsAddingAddress(false);
      setEditingAddressId(null);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error saving address:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar la dirección. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Handle canceling address form
  const handleCancelAddressForm = () => {
    setIsAddressFormVisible(false);
    setIsAddingAddress(false);
    setEditingAddressId(null);
    resetAddress();

    if (addresses.length === 0) {
      setIsAddressFormVisible(true);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle continue to shipping details
  const handleContinueToShippingDetails = () => {
    if (!selectedAddressId && addresses.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Selecciona una dirección",
        text: "Por favor selecciona una dirección de envío para continuar",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    if (addresses.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Agrega una dirección",
        text: "Por favor agrega una dirección de envío para continuar",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setShowShippingDetails(true);
    setTimeout(() => {
      document
        .getElementById("shipping-details-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Handle shipping details form submission
  const onSubmitShippingDetails: SubmitHandler<
    ShippingDetailsFormData
  > = async (data) => {
    onAddressSelected(data);
  };

  return (
    <>
      {/* User info summary */}
      {user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-100 dark:border-blue-800/50">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-2">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
              Información personal
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nombre:
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name} {user.surname}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email:</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Teléfono:
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.phone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address selection */}
      {!showShippingDetails && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500" />
              Dirección de envío
            </h3>
            {addresses.length > 0 && !isAddressFormVisible && (
              <button
                type="button"
                onClick={handleAddAddress}
                className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Añadir nueva dirección
              </button>
            )}
          </div>

          {/* Loading state for addresses */}
          {isLoadingAddresses && (
            <div className="flex justify-center items-center py-8">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
              </div>
              <p className="ml-3 text-gray-600 dark:text-gray-400">
                Cargando direcciones...
              </p>
            </div>
          )}

          {/* Error state for addresses */}
          {addressError && !isLoadingAddresses && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {addressError}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddAddress}
                className="mt-3 text-sm text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Añadir nueva dirección manualmente
              </button>
            </div>
          )}

          {/* Address list */}
          {!isLoadingAddresses &&
            addresses.length > 0 &&
            !isAddressFormVisible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAddressId === address.id.toString()
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                    onClick={() => setSelectedAddressId(address.id.toString())}
                  >
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`address-${address.id}`}
                          name="selectedAddress"
                          checked={selectedAddressId === address.id.toString()}
                          onChange={() =>
                            setSelectedAddressId(address.id.toString())
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor={`address-${address.id}`}
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                        >
                          {address.street}
                        </label>
                        {address.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                          className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-500"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id.toString());
                          }}
                          className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-500"
                        >
                          {isDeleting === address.id.toString() ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="pl-6 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>{address.colony}</p>
                      <p>
                        {address.city}, {address.state}
                      </p>
                      <p>
                        {address.country} - {address.postalCode}
                      </p>
                      {address.references && <p>Ref: {address.references}</p>}
                    </div>
                    {!address.isDefault &&
                      selectedAddressId === address.id.toString() && (
                        <div className="mt-3 pl-6">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefaultAddress(address.id.toString());
                            }}
                            className="text-xs text-blue-600 dark:text-blue-500 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1.5 text-blue-600 dark:text-blue-500" />
                            Establecer como predeterminada
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

          {/* Address form */}
          {isAddressFormVisible && (
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

              <form
                onSubmit={handleSubmitAddress(onSubmitAddress)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Calle */}
                  <div className="space-y-2">
                    <label
                      htmlFor="street"
                      className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                      <Home className="w-4 h-4 mr-2 text-blue-600" />
                      Calle y número *
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="street"
                        placeholder="Ej. Av. Constitución 123"
                        {...registerAddress(
                          "street",
                          addressValidationRules.street
                        )}
                        className={`block w-full rounded-lg border ${
                          addressErrors.street
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                      />
                      {addressErrors.street && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {addressErrors.street && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {addressErrors.street.message}
                      </p>
                    )}
                  </div>

                  {/* Colonia */}
                  <div className="space-y-2">
                    <label
                      htmlFor="colony"
                      className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                      <Building className="w-4 h-4 mr-2 text-blue-600" />
                      Colonia *
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="colony"
                        placeholder="Ej. Centro"
                        {...registerAddress(
                          "colony",
                          addressValidationRules.colony
                        )}
                        className={`block w-full rounded-lg border ${
                          addressErrors.colony
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                      />
                      {addressErrors.colony && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {addressErrors.colony && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {addressErrors.colony.message}
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
                      Ciudad *
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="city"
                        placeholder="Ej. Monterrey"
                        {...registerAddress(
                          "city",
                          addressValidationRules.city
                        )}
                        className={`block w-full rounded-lg border ${
                          addressErrors.city
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                      />
                      {addressErrors.city && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {addressErrors.city && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {addressErrors.city.message}
                      </p>
                    )}
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <label
                      htmlFor="state"
                      className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                      <Building className="w-4 h-4 mr-2 text-blue-600" />
                      Estado *
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="state"
                        placeholder="Ej. Nuevo León"
                        {...registerAddress(
                          "state",
                          addressValidationRules.state
                        )}
                        className={`block w-full rounded-lg border ${
                          addressErrors.state
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                      />
                      {addressErrors.state && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {addressErrors.state && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {addressErrors.state.message}
                      </p>
                    )}
                  </div>

                  {/* Código Postal */}
                  <div className="space-y-2">
                    <label
                      htmlFor="postalCode"
                      className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      Código Postal *
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="postalCode"
                        placeholder="Ej. 64000"
                        {...registerAddress(
                          "postalCode",
                          addressValidationRules.postalCode
                        )}
                        className={`block w-full rounded-lg border ${
                          addressErrors.postalCode
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                      />
                      {addressErrors.postalCode && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {addressErrors.postalCode && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {addressErrors.postalCode.message}
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
                      País *
                    </label>
                    <div className="relative group">
                      <select
                        id="country"
                        {...registerAddress(
                          "country",
                          addressValidationRules.country
                        )}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none"
                      >
                        <option value="México">México</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="España">España</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        <ChevronDown className="h-5 w-5" />
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
                        placeholder="Ej. Casa blanca con rejas negras, frente a la farmacia"
                        {...registerAddress(
                          "references",
                          addressValidationRules.references
                        )}
                        rows={2}
                        className={`block w-full rounded-lg border ${
                          addressErrors.references
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                      />
                    </div>
                    {addressErrors.references && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {addressErrors.references.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Default checkbox */}
                {(isAddingAddress || !watchAddress("isDefault")) && (
                  <div className="flex items-center mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-blue-800 dark:text-blue-300 py-3 rounded-xl px-4">
                    <input
                      type="checkbox"
                      id="isDefault"
                      {...registerAddress("isDefault")}
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

                {/* Form buttons */}
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
                    type="submit"
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
                        {isAddingAddress
                          ? "Guardar dirección"
                          : "Actualizar dirección"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Empty state */}
          {!isLoadingAddresses &&
            addresses.length === 0 &&
            !isAddressFormVisible && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No tienes direcciones guardadas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Añade una dirección para continuar con tu compra
                </p>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium flex items-center mx-auto"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir dirección
                </button>
              </div>
            )}

          {/* Continue to Shipping Details Button */}
          {!isAddressFormVisible && (
            <div className="flex justify-end">
              <button
                onClick={handleContinueToShippingDetails}
                disabled={!selectedAddressId && addresses.length > 0}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar a detalles de envío
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Shipping Details Form */}
      {showShippingDetails && (
        <div
          id="shipping-details-form"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-800/50 rounded-full p-2">
              <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="ml-3 text-base font-medium text-gray-900 dark:text-white">
              Detalles de entrega
            </h3>
          </div>

          <form
            onSubmit={handleSubmitShipping(onSubmitShippingDetails)}
            className="space-y-4"
          >
            {/* Referencias de entrega */}
            <div className="space-y-2">
              <label
                htmlFor="shipping-references"
                className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                <Info className="w-4 h-4 mr-2 text-blue-600" />
                Referencias para la entrega *
              </label>
              <div className="relative group">
                <textarea
                  id="shipping-references"
                  placeholder="Ej. Casa de dos pisos color azul, portón negro, timbre del lado derecho. Entregar en horario de 9am a 6pm"
                  {...registerShipping(
                    "references",
                    shippingValidationRules.references
                  )}
                  rows={3}
                  className={`block w-full rounded-lg border ${
                    shippingErrors.references
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                />
                {shippingErrors.references && (
                  <div className="absolute top-3 right-3 pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {shippingErrors.references && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {shippingErrors.references.message}
                </p>
              )}
            </div>

            {/* Entre calles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="betweenStreetOne"
                  className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  <Navigation className="w-4 h-4 mr-2 text-blue-600" />
                  Entre calle 1 *
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="betweenStreetOne"
                    placeholder="Ej. Av. Juárez"
                    {...registerShipping(
                      "betweenStreetOne",
                      shippingValidationRules.betweenStreetOne
                    )}
                    className={`block w-full rounded-lg border ${
                      shippingErrors.betweenStreetOne
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                  />
                  {shippingErrors.betweenStreetOne && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {shippingErrors.betweenStreetOne && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {shippingErrors.betweenStreetOne.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="betweenStreetTwo"
                  className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  <Navigation className="w-4 h-4 mr-2 text-blue-600" />
                  Entre calle 2 *
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    id="betweenStreetTwo"
                    placeholder="Ej. Calle Morelos"
                    {...registerShipping(
                      "betweenStreetTwo",
                      shippingValidationRules.betweenStreetTwo
                    )}
                    className={`block w-full rounded-lg border ${
                      shippingErrors.betweenStreetTwo
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                  />
                  {shippingErrors.betweenStreetTwo && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {shippingErrors.betweenStreetTwo && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {shippingErrors.betweenStreetTwo.message}
                  </p>
                )}
              </div>
            </div>

            {/* Info adicional */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm mb-1">
                    Información importante para la entrega
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>
                      • Proporciona referencias claras para facilitar la entrega
                    </li>
                    <li>• Incluye horarios preferenciales si es necesario</li>
                    <li>
                      • Menciona puntos de referencia visibles (tiendas,
                      colores, etc.)
                    </li>
                    <li>
                      • Las calles de referencia ayudan al repartidor a ubicar
                      tu domicilio
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form buttons */}
            <div className="flex justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowShippingDetails(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a direcciones
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Continuar al pago
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
