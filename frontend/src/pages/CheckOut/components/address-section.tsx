"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  Map,
} from "lucide-react";
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
import { AlertHelper } from "@/utils/alert.util";
import { getUserSaleReferences } from "@/api/sales";

// Define the new type for sale references
interface SaleReference {
  reference: string;
  betweenStreetOne: string;
  betweenStreetTwo: string;
}

interface AddressSectionProps {
  user: any;
  onAddressSelected: (shippingDetails: ShippingDetailsFormData) => void;
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  addresses: Direction[];
  setAddresses: (addresses: Direction[]) => void;
}

// Memoized constants and helpers
const MEXICO_STATES = [
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
] as const;

const COUNTRIES = [
  { value: "México", label: "México" },
  { value: "Estados Unidos", label: "Estados Unidos" },
  { value: "España", label: "España" },
] as const;

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
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const [previousReferences, setPreviousReferences] = useState<SaleReference[]>(
    []
  );
  const [selectedPreviousReference, setSelectedPreviousReference] =
    useState<string>("new");
  const [isLoadingPreviousReferences, setIsLoadingPreviousReferences] =
    useState(false);

  // Memoized form hooks
  const addressForm = useForm<AddressFormData>({
    defaultValues: {
      street: "",
      city: "",
      state: "",
      country: "México",
      postalCode: "",
      colony: "",
      isDefault: false,
    },
    mode: "onChange",
  });

  const shippingForm = useForm<ShippingDetailsFormData>({
    defaultValues: {
      references: "",
      betweenStreetOne: "",
      betweenStreetTwo: "",
    },
    mode: "onChange",
  });

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors },
    reset: resetAddress,
    watch: watchAddress,
  } = addressForm;

  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: shippingErrors },
    setValue: setShippingValue,
  } = shippingForm;

  const selectedCountry = watchAddress("country");

  // Memoized state options
  const states = useMemo(() => {
    return selectedCountry === "México" ? MEXICO_STATES : [];
  }, [selectedCountry]);

  // Memoized user info
  const userInfo = useMemo(() => {
    if (!user) return null;
    return {
      name: `${user.name} ${user.surname}`,
      email: user.email,
      phone: user.phone,
    };
  }, [user]);

  // Memoized address loading function
  const loadUserAddresses = useCallback(async () => {
    if (!user?.id) {
      setIsLoadingAddresses(false);
      return;
    }

    try {
      setIsLoadingAddresses(true);
      setAddressError(null);
      const response = await getUserAddresses(Number(user.id));
      const userAddresses = response.data || [];

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

      // Set default or first address as selected
      const defaultAddress = transformedAddresses.find(
        (addr) => addr.isDefault
      );
      if (defaultAddress?.id) {
        setSelectedAddressId(defaultAddress.id.toString());
      } else if (
        transformedAddresses.length > 0 &&
        transformedAddresses[0].id
      ) {
        setSelectedAddressId(transformedAddresses[0].id.toString());
      } else {
        setIsAddressFormVisible(true);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error cargando direcciones.";
      AlertHelper.error({
        message: errorMessage,
        title: "Error",
        animation: "slideIn",
        timer: 5000,
      });
      setAddressError(
        "No se pudieron cargar las direcciones. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [user, setAddresses, setSelectedAddressId]);

  // Memoized references loading function
  const loadPreviousReferences = useCallback(async () => {
    if (!user?.id || !showShippingDetails) return;

    setIsLoadingPreviousReferences(true);
    try {
      const response = await getUserSaleReferences(String(user.id));
      const fetchedReferences: SaleReference[] = response.data || [];
      setPreviousReferences(fetchedReferences);

      if (fetchedReferences.length > 0) {
        const firstReference = fetchedReferences[0];
        setSelectedPreviousReference(firstReference.reference);
        setShippingValue("references", firstReference.reference);
        setShippingValue("betweenStreetOne", firstReference.betweenStreetOne);
        setShippingValue("betweenStreetTwo", firstReference.betweenStreetTwo);
      } else {
        setSelectedPreviousReference("new");
        setShippingValue("references", "");
        setShippingValue("betweenStreetOne", "");
        setShippingValue("betweenStreetTwo", "");
      }
    } catch (error) {
      console.error("Error fetching previous references:", error);
      AlertHelper.error({
        title: "Error",
        message: "No se pudieron cargar las referencias anteriores.",
        animation: "slideIn",
        timer: 5000,
      });
      setPreviousReferences([]);
      setSelectedPreviousReference("new");
    } finally {
      setIsLoadingPreviousReferences(false);
    }
  }, [user, showShippingDetails, setShippingValue]);

  // Effects
  useEffect(() => {
    loadUserAddresses();
  }, [loadUserAddresses]);

  useEffect(() => {
    loadPreviousReferences();
  }, [loadPreviousReferences]);

  // Memoized event handlers
  const handlePreviousReferenceChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setSelectedPreviousReference(selectedValue);

      if (selectedValue === "new") {
        setShippingValue("references", "");
        setShippingValue("betweenStreetOne", "");
        setShippingValue("betweenStreetTwo", "");
      } else {
        const selectedRef = previousReferences.find(
          (ref) => ref.reference === selectedValue
        );
        if (selectedRef) {
          setShippingValue("references", selectedRef.reference);
          setShippingValue("betweenStreetOne", selectedRef.betweenStreetOne);
          setShippingValue("betweenStreetTwo", selectedRef.betweenStreetTwo);
        }
      }
    },
    [previousReferences, setShippingValue]
  );

  const handleAddAddress = useCallback(() => {
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

    requestAnimationFrame(() => {
      document.getElementById("address-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [resetAddress]);

  const handleEditAddress = useCallback(
    (address: Direction) => {
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

      requestAnimationFrame(() => {
        document.getElementById("address-form")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [resetAddress]
  );

  const handleDeleteAddress = useCallback(
    (id: string) => {
      AlertHelper.confirm({
        title: "¿Estás seguro?",
        message: "Esta acción no se puede revertir",
        type: "warning",
        confirmText: "Sí, eliminar",
        cancelText: "Cancelar",
        animation: "bounce",
      }).then(async (isConfirmed) => {
        if (isConfirmed) {
          try {
            const numericId = Number.parseInt(id);
            setIsDeleting(id);

            if (user?.id) {
              const addressToDelete = addresses.find(
                (addr) => addr.id === numericId
              );
              const addressId = addressToDelete?.userAddressId || numericId;
              await deleteAddressUser(Number(user.id), addressId);
            }

            const updatedAddresses = addresses.filter(
              (addr) => addr.id !== numericId
            );
            setAddresses(updatedAddresses);

            if (selectedAddressId === id) {
              const defaultAddress = updatedAddresses.find(
                (addr) => addr.isDefault
              );
              if (defaultAddress?.id) {
                setSelectedAddressId(defaultAddress.id.toString());
              } else if (updatedAddresses.length > 0) {
                setSelectedAddressId(updatedAddresses[0].id.toString());
              } else {
                setSelectedAddressId(null);
                setIsAddressFormVisible(true);
              }
            }

            AlertHelper.success({
              title: "¡Eliminada!",
              message: "La dirección ha sido eliminada.",
              animation: "slideIn",
              timer: 2000,
            });
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message || "Error eliminando la dirección.";
            AlertHelper.error({
              message: errorMessage,
              title: "Error",
              animation: "slideIn",
              timer: 5000,
              showToast: false,
            });
          } finally {
            setIsDeleting(null);
          }
        }
      });
    },
    [user, addresses, setAddresses, selectedAddressId, setSelectedAddressId]
  );

  const handleSetDefaultAddress = useCallback(
    async (id: string) => {
      try {
        const numericId = Number.parseInt(id);
        const addressToUpdate = addresses.find((addr) => addr.id === numericId);

        if (user?.id && addressToUpdate) {
          const addressId = addressToUpdate.userAddressId || numericId;
          await setDefaultAddressUser(Number(user.id), addressId);
        }

        const updatedAddresses = addresses.map((address) => ({
          ...address,
          isDefault: address.id === numericId,
        }));

        setAddresses(updatedAddresses);
        setSelectedAddressId(id);

        AlertHelper.success({
          title: "¡Actualizada!",
          message: "La dirección ha sido actualizada.",
          animation: "slideIn",
          timer: 2000,
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Error actualizando la dirección.";
        AlertHelper.error({
          message: errorMessage,
          title: "Error",
          animation: "slideIn",
          timer: 5000,
        });
      }
    },
    [user, addresses, setAddresses, setSelectedAddressId]
  );

  const onSubmitAddress = useCallback<SubmitHandler<AddressFormData>>(
    async (data) => {
      try {
        setIsSavingAddress(true);
        const addressData = {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          colony: data.colony,
          isDefault: data.isDefault,
        };

        if (editingAddressId && user?.id) {
          // Editing existing address
          const editingIdNumber = Number.parseInt(editingAddressId);
          const addressToEdit = addresses.find(
            (addr) => addr.id === editingIdNumber
          );
          const addressId = addressToEdit?.userAddressId || editingIdNumber;

          await updateAddressUser(Number(user.id), addressId, addressData);

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

          AlertHelper.success({
            title: "¡Actualizada!",
            message: "La dirección ha sido actualizada.",
            animation: "slideIn",
            timer: 2000,
          });
        } else if (user?.id) {
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

          AlertHelper.success({
            title: "¡Creada!",
            message: "La dirección ha sido creada.",
            animation: "slideIn",
            timer: 2000,
          });
        }

        setIsAddressFormVisible(false);
        setIsAddingAddress(false);
        setEditingAddressId(null);

        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        AlertHelper.error({
          title: "Error al agregar la dirección",
          message:
            errorMessage ||
            "Hubo un problema al agregar la dirección. Por favor intenta nuevamente.",
          timer: 6000,
          animation: "slideIn",
        });
      } finally {
        setIsSavingAddress(false);
      }
    },
    [
      editingAddressId,
      user,
      addresses,
      setAddresses,
      selectedAddressId,
      setSelectedAddressId,
    ]
  );

  const handleCancelAddressForm = useCallback(() => {
    setIsAddressFormVisible(false);
    setIsAddingAddress(false);
    setEditingAddressId(null);
    resetAddress();

    if (addresses.length === 0) {
      setIsAddressFormVisible(true);
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [addresses.length, resetAddress]);

  const handleContinueToShippingDetails = useCallback(() => {
    if (!selectedAddressId && addresses.length > 0) {
      AlertHelper.error({
        title: "Selecciona una dirección",
        message: "Por favor selecciona una dirección de envío para continuar",
        animation: "slideIn",
        timer: 3000,
      });
      return;
    }

    if (addresses.length === 0) {
      AlertHelper.error({
        title: "Agrega una dirección",
        message: "Por favor agrega una dirección de envío para continuar",
        animation: "slideIn",
        timer: 3000,
      });
      return;
    }

    setShowShippingDetails(true);

    requestAnimationFrame(() => {
      document.getElementById("shipping-details-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [selectedAddressId, addresses.length]);

  const onSubmitShippingDetails = useCallback<
    SubmitHandler<ShippingDetailsFormData>
  >(
    (data) => {
      onAddressSelected(data);
    },
    [onAddressSelected]
  );

  // Memoized components
  const UserInfoSection = useMemo(() => {
    if (!userInfo) return null;

    return (
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Nombre:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userInfo.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userInfo.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Teléfono:
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userInfo.phone}
            </p>
          </div>
        </div>
      </div>
    );
  }, [userInfo]);

  const AddressList = useMemo(() => {
    if (isLoadingAddresses) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="w-10 h-10 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800 opacity-25"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-500 border-gray-200 dark:border-gray-800 animate-spin"></div>
          </div>
          <p className="ml-3 text-gray-600 dark:text-gray-400">
            Cargando direcciones...
          </p>
        </div>
      );
    }

    if (addressError && !isLoadingAddresses) {
      return (
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
      );
    }

    if (addresses.length > 0 && !isAddressFormVisible) {
      return (
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
                    onChange={() => setSelectedAddressId(address.id.toString())}
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
      );
    }

    return null;
  }, [
    isLoadingAddresses,
    addressError,
    addresses,
    isAddressFormVisible,
    selectedAddressId,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
    isDeleting,
    setSelectedAddressId,
  ]);

  const EmptyState = useMemo(() => {
    if (
      !isLoadingAddresses &&
      addresses.length === 0 &&
      !isAddressFormVisible
    ) {
      return (
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
      );
    }
    return null;
  }, [
    isLoadingAddresses,
    addresses.length,
    isAddressFormVisible,
    handleAddAddress,
  ]);

  const AddressForm = useMemo(() => {
    if (!isAddressFormVisible) return null;

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
                  {...registerAddress("street", addressValidationRules.street)}
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
                  {...registerAddress("colony", addressValidationRules.colony)}
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
                  {...registerAddress("city", addressValidationRules.city)}
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
                <Map className="w-4 h-4 mr-2 text-blue-600" />
                Estado *
              </label>
              <div className="relative group">
                <select
                  id="state"
                  {...registerAddress("state", addressValidationRules.state)}
                  className={`block w-full rounded-lg border appearance-none ${
                    addressErrors.state
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400`}
                >
                  <option value="">Seleccionar estado</option>
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                {addressErrors.state ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                ) : (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <ChevronDown className="h-5 w-5" />
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
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
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
    );
  }, [
    isAddressFormVisible,
    isAddingAddress,
    addresses.length,
    handleCancelAddressForm,
    handleSubmitAddress,
    onSubmitAddress,
    registerAddress,
    addressErrors,
    states,
    watchAddress,
    isSavingAddress,
  ]);

  const ShippingDetailsForm = useMemo(() => {
    if (!showShippingDetails) return null;

    return (
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
          {/* Previous References Select */}
          {isLoadingPreviousReferences ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <p className="ml-2 text-gray-600 dark:text-gray-400">
                Cargando referencias anteriores...
              </p>
            </div>
          ) : (
            previousReferences.length > 0 && (
              <div className="space-y-2">
                <label
                  htmlFor="previous-references-select"
                  className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-medium"
                >
                  <Info className="w-4 h-4 mr-2 text-blue-600" />
                  Seleccionar referencia anterior
                </label>
                <div className="relative group">
                  <select
                    id="previous-references-select"
                    value={selectedPreviousReference}
                    onChange={handlePreviousReferenceChange}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none"
                  >
                    {previousReferences.map((ref, index) => (
                      <option key={index} value={ref.reference}>
                        {ref.reference}
                      </option>
                    ))}
                    <option value="new">Añadir nueva referencia</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
          )}

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
                    • Menciona puntos de referencia visibles (tiendas, colores,
                    etc.)
                  </li>
                  <li>
                    • Las calles de referencia ayudan al repartidor a ubicar tu
                    domicilio
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
    );
  }, [
    showShippingDetails,
    isLoadingPreviousReferences,
    previousReferences,
    selectedPreviousReference,
    handlePreviousReferenceChange,
    handleSubmitShipping,
    onSubmitShippingDetails,
    registerShipping,
    shippingErrors,
  ]);

  return (
    <>
      {UserInfoSection}

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

          {AddressList}
          {EmptyState}
          {AddressForm}

          {/* Continue to Shipping Details Button */}
          {!isAddressFormVisible && addresses.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleContinueToShippingDetails}
                disabled={!selectedAddressId}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar a detalles de envío
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {ShippingDetailsForm}
    </>
  );
}
