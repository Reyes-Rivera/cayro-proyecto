"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Swal from "sweetalert2";

import {
  getUserAddresses,
  addAddressUser,
  updateAddressUser,
  deleteAddressUser,
} from "@/api/users";
import type { Direction, FormErrors } from "@/types/checkout";

// Modificar la interfaz AddressSectionProps para usar UserAdapter en lugar de UserInterface
interface AddressSectionProps {
  user: any; // Cambiamos el tipo para aceptar cualquier tipo de usuario
  onAddressSelected: () => void;
}

// Modificar la función para adaptar el usuario al formato esperado
export default function AddressSection({
  user,
  onAddressSelected,
}: AddressSectionProps) {
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Addresses state
  const [addresses, setAddresses] = useState<Direction[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // New address form state
  const [newAddress, setNewAddress] = useState<Direction>({
    street: "",
    city: "",
    country: "México",
    neighborhood: "",
    references: "",
    id: 0,
    isDefault: false,
  });

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

        // Llamada a la API para obtener las direcciones
        const response = await getUserAddresses(+user.id);
        // Extraer las direcciones de la respuesta
        const userAddresses = response.data || [];

        setAddresses(userAddresses);

        // Set default address as selected
        const defaultAddress = userAddresses.find(
          (addr: Direction) => addr.isDefault
        );
        if (defaultAddress && defaultAddress.id) {
          setSelectedAddressId(defaultAddress.id.toString());
        } else if (userAddresses.length > 0 && userAddresses[0].id) {
          setSelectedAddressId(userAddresses[0].id.toString());
        } else {
          // If no addresses, show the form
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
  }, [user]);

  // Handle form input changes for new address
  const handleAddressInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setNewAddress((prev:any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev:any) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate address form
  const validateAddressForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newAddress.street.trim()) {
      newErrors.street = "La dirección es requerida";
    }

    if (!newAddress.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    if (!newAddress.country.trim()) {
      newErrors.country = "El país es requerido";
    }

    if (!newAddress.neighborhood.trim()) {
      newErrors.neighborhood = "La colonia es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding a new address
  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setEditingAddressId(null);
    setIsAddressFormVisible(true);
    setNewAddress({
      street: "",
      city: "",
      country: "México",
      neighborhood: "",
      references: "",
      id: 0,
      isDefault: false,
    });

    // Scroll to form
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
    setNewAddress(address);

    // Scroll to form
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

          // Call API to delete the address
          if (user && user.id) {
            await deleteAddressUser(+user.id, numericId);
          }

          // Remove address from state
          setAddresses(addresses.filter((addr) => addr.id !== numericId));

          // If deleted address was selected, select another one
          if (selectedAddressId === id) {
            const defaultAddress = addresses.find(
              (addr) => addr.isDefault && addr.id !== numericId
            );
            if (defaultAddress && defaultAddress.id) {
              setSelectedAddressId(defaultAddress.id.toString());
            } else if (addresses.length > 1) {
              const newSelectedId = addresses.find(
                (addr) => addr.id !== numericId
              )?.id;
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

      // Call API to update default address
      if (user && user.id) {
        await updateDefaultAddress(user.id, numericId);
      }

      // Update addresses in state
      setAddresses(
        addresses.map((address) => ({
          ...address,
          isDefault: address.id === numericId,
        }))
      );
      setSelectedAddressId(id);

      // Show success message
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

  // Handle saving a new address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateAddressForm()) {
      try {
        setIsSavingAddress(true);

        if (editingAddressId && user && user.id) {
          // Update existing address
          const editingIdNumber = Number.parseInt(editingAddressId);

          // Call API to update address
          const addressData = {
            street: newAddress.street,
            city: newAddress.city,
            country: newAddress.country,
            neighborhood: newAddress.neighborhood,
            references: newAddress.references,
            isDefault: newAddress.isDefault,
          };

          await updateAddressUser(+user.id, editingIdNumber, addressData);

          setAddresses(
            addresses.map((addr) =>
              addr.id === editingIdNumber
                ? { ...newAddress, id: editingIdNumber }
                : addr
            )
          );

          if (newAddress.isDefault) {
            // If setting as default, update all other addresses
            await updateDefaultAddress(user.id, editingIdNumber);

            setAddresses((prev) =>
              prev.map((addr) => ({
                ...addr,
                isDefault: addr.id === editingIdNumber,
              }))
            );
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
          // Add new address
          // Call API to add new address
          const addressData = {
            street: newAddress.street,
            city: newAddress.city,
            country: newAddress.country,
            neighborhood: newAddress.neighborhood,
            references: newAddress.references,
            isDefault: newAddress.isDefault || addresses.length === 0,
          };

          const addedAddress = await addUserAddress(user.id, addressData);

          if (newAddress.isDefault || addresses.length === 0) {
            // If this is default or the first address, update all addresses
            await updateDefaultAddress(user.id, addedAddress.id);

            setAddresses((prev) => [
              ...prev.map((addr) => ({ ...addr, isDefault: false })),
              { ...addedAddress, isDefault: true },
            ]);
            setSelectedAddressId(addedAddress.id.toString());
          } else {
            setAddresses([...addresses, addedAddress]);
            if (!selectedAddressId) {
              setSelectedAddressId(addedAddress.id.toString());
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

        // Scroll back to address list
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
    }
  };

  // Handle canceling address form
  const handleCancelAddressForm = () => {
    setIsAddressFormVisible(false);
    setIsAddingAddress(false);
    setEditingAddressId(null);

    // If no addresses and canceling, show empty state
    if (addresses.length === 0) {
      setIsAddressFormVisible(true);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle shipping form submission
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      selectedAddressId ||
      (addresses.length === 0 && validateAddressForm())
    ) {
      try {
        // If adding a new address and no addresses exist, save it first
        if (addresses.length === 0 && isAddressFormVisible && user && user.id) {
          setIsSavingAddress(true);

          // Call API to add new address
          const addressData = {
            street: newAddress.street,
            city: newAddress.city,
            country: newAddress.country,
            neighborhood: newAddress.neighborhood,
            references: newAddress.references,
            isDefault: true,
          };

          const addedAddress = await addUserAddress(user.id, addressData);

          setAddresses([{ ...addedAddress, isDefault: true }]);
          setSelectedAddressId(addedAddress.id.toString());

          setIsSavingAddress(false);
        }

        onAddressSelected();
      } catch (error) {
        console.error("Error saving address during checkout:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo guardar la dirección. Por favor, inténtalo de nuevo.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Selecciona una dirección",
        text: "Por favor selecciona una dirección de envío para continuar",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // Helper function for updating default address
  const updateDefaultAddress = async (
    userId: string,
    addressId: number
  ): Promise<void> => {
    try {
      // Convertir el userId a número ya que la API espera un número
      const numericId = Number.parseInt(userId);

      // Primero, obtenemos todas las direcciones para actualizar sus estados
      const response = await getUserAddresses(numericId);
      const addresses = response.data || [];

      // Para cada dirección, actualizamos su estado isDefault
      for (const address of addresses) {
        if (address.id === addressId) {
          // Establecer esta dirección como predeterminada
          await updateAddressUser(numericId, address.id, {
            ...address,
            isDefault: true,
          });
        } else if (address.isDefault) {
          // Quitar el estado predeterminado de otras direcciones
          await updateAddressUser(numericId, address.id, {
            ...address,
            isDefault: false,
          });
        }
      }
    } catch (error) {
      console.error("Error updating default address:", error);
      throw new Error("Error al establecer la dirección predeterminada");
    }
  };

  // Helper function for adding user address
  const addUserAddress = async (
    userId: string,
    address: Omit<Direction, "id">
  ): Promise<Direction> => {
    try {
      // Convertir el userId a número ya que la API espera un número
      const numericId = Number.parseInt(userId);
      const response = await addAddressUser(numericId, address);

      // Asumiendo que la respuesta tiene una estructura como { data: Direction }
      return response.data;
    } catch (error) {
      console.error("Error adding user address:", error);
      throw new Error("Error al añadir la dirección");
    }
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
      <form onSubmit={handleShippingSubmit}>
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
                      <p>{address.neighborhood}</p>
                      <p>
                        {address.city}, {address.country}
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
                            <CheckCircle2 className="w-3 h-3 mr-1" />
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
                      setNewAddress({
                        ...newAddress,
                        isDefault: e.target.checked,
                      })
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
                      {isAddingAddress
                        ? "Guardar dirección"
                        : "Actualizar dirección"}
                    </>
                  )}
                </button>
              </div>
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
        </div>
      </form>
    </>
  );
}
