"use client";
import type React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  CameraIcon,
  Edit,
  Save,
  X,
  Info,
  Phone,
  Book,
  Loader2,
  Building2,
  MessageSquareQuote,
  Mail,
  MapPin,
  Target,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { companyInfoUpdateApi, getCompanyInfoApi } from "@/api/company";
import { useAuth } from "@/context/AuthContextType";
import { useNavigate } from "react-router-dom";
import { AlertHelper } from "@/utils/alert.util";

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface InfoCompany {
  title: string;
  slogan: string;
  logoUrl: string;
  contactInfo: ContactInfo[];
  mission: string;
  vision: string;
  socialLinks: string[];
}

// Memoizar la configuración de tabs
const tabConfig = [
  {
    id: "datos",
    label: "Datos de la Empresa",
    icon: <Building2 size={18} aria-hidden="true" />,
  },
  {
    id: "contacto",
    label: "Información de Contacto",
    icon: <Phone size={18} aria-hidden="true" />,
  },
  {
    id: "adicionales",
    label: "Filosofía Corporativa",
    icon: <Book size={18} aria-hidden="true" />,
  },
] as const;

// Componente para el overlay de carga
const LoadingOverlay: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl"
      role="status"
      aria-label="Subiendo imagen"
    >
      <div className="bg-white/20 p-4 rounded-full">
        <Loader2
          className="w-8 h-8 animate-spin text-white"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

// Componente para el logo
const LogoSection: React.FC<{
  logo: string | null;
  defaultLogo: string | null;
  isEditing: boolean;
  isUpload: boolean;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ logo, isEditing, isUpload, onImageChange }) => {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <div
          className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
          role="img"
          aria-label="Logo de la empresa"
        >
          {logo ? (
            <img
              src={logo}
              alt="Logo de la empresa"
              className="w-full h-full object-contain p-4"
              loading="lazy"
              width={256}
              height={256}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            >
              <Building2 className="w-16 h-16 mb-2 opacity-50" />
              <span className="text-sm">Sin logo</span>
            </div>
          )}

          <LoadingOverlay isVisible={isUpload} />

          {isEditing && !isUpload && (
            <div
              className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center"
              aria-hidden="true"
            >
              <label
                htmlFor="logoUpload"
                className="bg-blue-500 hover:bg-blue-600 p-4 rounded-full shadow-lg cursor-pointer transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                tabIndex={isEditing ? 0 : -1}
              >
                <CameraIcon className="w-6 h-6 text-white" aria-hidden="true" />
                <span className="sr-only">Cambiar logo</span>
              </label>
            </div>
          )}
        </div>

        {isEditing && !isUpload && (
          <div className="mt-3">
            <label
              htmlFor="logoUpload"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              tabIndex={isEditing ? 0 : -1}
            >
              <CameraIcon className="w-4 h-4" aria-hidden="true" />
              Cambiar Logo
            </label>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/png, image/jpeg"
        id="logoUpload"
        className="hidden"
        onChange={onImageChange}
        disabled={!isEditing || isUpload}
        aria-describedby="logo-info"
      />

      <div
        id="logo-info"
        className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
        role="complementary"
        aria-label="Información del logo"
      >
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" aria-hidden="true" />
          Información del Logo
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• Formato: PNG o JPEG</li>
          <li>• Tamaño máximo: 2MB</li>
          <li>• Resolución recomendada: 512x512px</li>
        </ul>
      </div>
    </div>
  );
};

// Componente para los tabs
const TabButtons: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ activeTab, setActiveTab }) => {
  return (
    <div
      className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700"
      role="tablist"
      aria-label="Secciones de información de la empresa"
    >
      {tabConfig.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium transition-all min-w-max ${
            activeTab === tab.id
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          id={`tab-${tab.id}`}
        >
          <div
            className={`p-2 rounded-full ${
              activeTab === tab.id
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            {tab.icon}
          </div>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// Componente para mensajes de error
const ErrorMessage: React.FC<{ message?: string }> = ({ message }) =>
  message ? (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
      <AlertCircle className="w-4 h-4" aria-hidden="true" />
      {message}
    </p>
  ) : null;

// Componente para la sección de datos de la empresa
const DatosTab: React.FC<{
  isEditing: boolean;
  errors: any;
  register: any;
}> = ({ isEditing, errors, register }) => {
  const commonInputClasses = (hasError: boolean, isEditingMode: boolean) =>
    `w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
      isEditingMode
        ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
    } ${
      hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    }`;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Building2
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Identidad Corporativa
          </h3>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="company-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Building2
                className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Nombre de la Empresa *
            </label>
            <input
              id="company-title"
              {...register("title", {
                required: "El nombre es obligatorio",
                pattern: {
                  value: /^[a-zA-Z\s.,;:!?'()-]{4,50}$/,
                  message:
                    "El nombre solo debe contener letras, espacios, y signos de puntuación (4-50 caracteres)",
                },
              })}
              disabled={!isEditing}
              className={commonInputClasses(!!errors.title, isEditing)}
              placeholder="Ej: Mi Empresa S.A. de C.V."
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            <ErrorMessage message={errors.title?.message} />
          </div>
          <div>
            <label
              htmlFor="company-slogan"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MessageSquareQuote
                className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Slogan *
            </label>
            <input
              id="company-slogan"
              {...register("slogan", {
                required: "El slogan es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9\s.,!?-]{4,50}$/,
                  message:
                    "El slogan solo debe contener letras, números, espacios y caracteres como . , ! ? - (4-50 caracteres)",
                },
              })}
              disabled={!isEditing}
              className={commonInputClasses(!!errors.slogan, isEditing)}
              placeholder="Ej: Innovación que transforma"
              aria-invalid={errors.slogan ? "true" : "false"}
              aria-describedby={errors.slogan ? "slogan-error" : undefined}
            />
            <ErrorMessage message={errors.slogan?.message} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para la sección de contacto
const ContactoTab: React.FC<{
  isEditing: boolean;
  errors: any;
  register: any;
}> = ({ isEditing, errors, register }) => {
  const commonInputClasses = (hasError: boolean, isEditingMode: boolean) =>
    `w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
      isEditingMode
        ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
    } ${
      hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    }`;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Phone
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Información de Contacto
          </h3>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="company-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Mail
                className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Correo Electrónico *
            </label>
            <input
              id="company-email"
              type="email"
              {...register("contactInfo.0.email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Formato de correo inválido",
                },
                maxLength: {
                  value: 200,
                  message: "El correo no puede tener más de 200 caracteres",
                },
              })}
              disabled={!isEditing}
              className={commonInputClasses(
                !!errors.contactInfo?.[0]?.email,
                isEditing
              )}
              placeholder="contacto@miempresa.com"
              aria-invalid={errors.contactInfo?.[0]?.email ? "true" : "false"}
              aria-describedby={
                errors.contactInfo?.[0]?.email ? "email-error" : undefined
              }
            />
            <ErrorMessage message={errors.contactInfo?.[0]?.email?.message} />
          </div>
          <div>
            <label
              htmlFor="company-phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Phone
                className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Teléfono *
            </label>
            <input
              id="company-phone"
              type="tel"
              {...register("contactInfo.0.phone", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El teléfono debe contener exactamente 10 dígitos",
                },
              })}
              disabled={!isEditing}
              className={commonInputClasses(
                !!errors.contactInfo?.[0]?.phone,
                isEditing
              )}
              placeholder="5512345678"
              aria-invalid={errors.contactInfo?.[0]?.phone ? "true" : "false"}
              aria-describedby={
                errors.contactInfo?.[0]?.phone ? "phone-error" : undefined
              }
            />
            <ErrorMessage message={errors.contactInfo?.[0]?.phone?.message} />
          </div>
          <div>
            <label
              htmlFor="company-address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <MapPin
                className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Dirección *
            </label>
            <textarea
              id="company-address"
              rows={3}
              {...register("contactInfo.0.address", {
                required: "La dirección es obligatoria",
                minLength: {
                  value: 10,
                  message: "La dirección debe tener al menos 10 caracteres",
                },
                maxLength: {
                  value: 200,
                  message: "La dirección no puede tener más de 200 caracteres",
                },
              })}
              disabled={!isEditing}
              className={`${commonInputClasses(
                !!errors.contactInfo?.[0]?.address,
                isEditing
              )} resize-none`}
              placeholder="Calle Principal #123, Colonia Centro, Ciudad, CP 12345"
              aria-invalid={errors.contactInfo?.[0]?.address ? "true" : "false"}
              aria-describedby={
                errors.contactInfo?.[0]?.address ? "address-error" : undefined
              }
            />
            <ErrorMessage message={errors.contactInfo?.[0]?.address?.message} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para la sección de filosofía corporativa
const AdicionalesTab: React.FC<{
  isEditing: boolean;
  errors: any;
  register: any;
  watch: any;
}> = ({ isEditing, errors, register, watch }) => {
  const commonInputClasses = (hasError: boolean, isEditingMode: boolean) =>
    `w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
      isEditingMode
        ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
    } ${
      hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    }`;

  const missionLength = watch("mission")?.length || 0;
  const visionLength = watch("vision")?.length || 0;

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Book
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Filosofía Corporativa
          </h3>
        </div>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="company-mission"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Target
                className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Misión *
            </label>
            <textarea
              id="company-mission"
              rows={4}
              {...register("mission", {
                required: "La misión es obligatoria",
                minLength: {
                  value: 10,
                  message: "La misión debe tener al menos 10 caracteres",
                },
                maxLength: {
                  value: 500,
                  message: "La misión no puede tener más de 500 caracteres",
                },
              })}
              disabled={!isEditing}
              className={`${commonInputClasses(
                !!errors.mission,
                isEditing
              )} resize-none`}
              placeholder="Describe el propósito fundamental de tu empresa..."
              aria-invalid={errors.mission ? "true" : "false"}
              aria-describedby={
                errors.mission
                  ? "mission-error mission-counter"
                  : "mission-counter"
              }
            />
            <ErrorMessage message={errors.mission?.message} />
            <p
              id="mission-counter"
              className="text-xs text-gray-500 dark:text-gray-400 mt-1"
            >
              Caracteres: {missionLength}/500
            </p>
          </div>
          <div>
            <label
              htmlFor="company-vision"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Lightbulb
                className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              Visión *
            </label>
            <textarea
              id="company-vision"
              rows={4}
              {...register("vision", {
                required: "La visión es obligatoria",
                minLength: {
                  value: 10,
                  message: "La visión debe tener al menos 10 caracteres",
                },
                maxLength: {
                  value: 200,
                  message: "La visión no puede tener más de 200 caracteres",
                },
              })}
              disabled={!isEditing}
              className={`${commonInputClasses(
                !!errors.vision,
                isEditing
              )} resize-none`}
              placeholder="Describe hacia dónde se dirige tu empresa en el futuro..."
              aria-invalid={errors.vision ? "true" : "false"}
              aria-describedby={
                errors.vision ? "vision-error vision-counter" : "vision-counter"
              }
            />
            <ErrorMessage message={errors.vision?.message} />
            <p
              id="vision-counter"
              className="text-xs text-gray-500 dark:text-gray-400 mt-1"
            >
              Caracteres: {visionLength}/200
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CompanyView() {
  const [activeTab, setActiveTab] = useState("datos");
  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [defaultLogo, setDefaultLogo] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isUpload, setIsUpload] = useState(false);
  const [id, setId] = useState<string | number>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<InfoCompany>();

  // Memoizar funciones con useCallback
  const handleCancelImg = useCallback(() => {
    setImage(null);
    setIsUpload(false);
    setLogo(defaultLogo);
  }, [defaultLogo]);

  const uploadImageToCloudinary = useCallback(async () => {
    if (!image) return;

    setIsUpload(true);
    const formData = new FormData();
    formData.append("file", image);
    const uploadPreset = "ml_default";
    const cloudName = "dhhv8l6ti";
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setLogo(data.secure_url);
      AlertHelper.success({
        title: "Imagen subida con éxito",
        message: "El logo ha sido actualizado correctamente.",
        timer: 3000,
        animation: "fadeIn",
      });
    } catch (error) {
      AlertHelper.error({
        title: "Error al subir imagen",
        message: "No se pudo subir la imagen, intenta nuevamente.",
        error,
        timer: 3000,
        animation: "fadeIn",
        isModal: true,
      });
    } finally {
      setIsUpload(false);
    }
  }, [image]);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const maxSize = 2 * 1024 * 1024; // 2 MB
      const validTypes = ["image/png", "image/jpeg"];

      if (file.size > maxSize) {
        AlertHelper.error({
          title: "Error",
          message: "La imagen debe ser de 2 MB o menos.",
          timer: 3000,
          animation: "fadeIn",
        });
        return;
      }

      if (!validTypes.includes(file.type)) {
        AlertHelper.error({
          title: "Error en el envío.",
          message: "La imagen debe ser en formato PNG o JPEG.",
          timer: 3000,
          animation: "fadeIn",
        });
        return;
      }

      setImage(file);
    },
    []
  );

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  // Efecto optimizado para la subida de imágenes
  useEffect(() => {
    if (image) {
      uploadImageToCloudinary();
    }
  }, [image, uploadImageToCloudinary]);

  // Efecto optimizado para cargar datos iniciales
  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await getCompanyInfoApi();
        const companyData = res.data[0];
        setLogo(companyData.logoUrl);
        setId(companyData.id);
        setDefaultLogo(companyData.logoUrl);
        setValue("title", companyData.title);
        setValue("slogan", companyData.slogan);
        setValue("contactInfo", companyData.contactInfo);
        setValue("mission", companyData.mission);
        setValue("vision", companyData.vision);
      } catch (error) {
        AlertHelper.error({
          title: "Error",
          message: "Algo salió mal, intenta de nuevo.",
          error,
          animation: "fadeIn",
          timer: 3000,
        });
      }
    };

    getInfo();
  }, [setValue]);

  const onSubmit: SubmitHandler<InfoCompany> = useCallback(
    async (data) => {
      try {
        const res = await companyInfoUpdateApi(
          { ...data, logoUrl: logo },
          Number(id),
          Number(user?.id)
        );

        if (res) {
          AlertHelper.success({
            title: "Éxito",
            message: "Información de la empresa actualizada correctamente",
            animation: "fadeIn",
            timer: 3000,
          });
          setIsEditing(false);
          return;
        }

        AlertHelper.error({
          title: "Error",
          message: "Algo salió mal, intenta de nuevo.",
          animation: "fadeIn",
          timer: 3000,
        });
      } catch (error) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
        }
        toggleEditing();
      }
    },
    [logo, id, user?.id, navigate, toggleEditing]
  );

  // Memoizar el contenido de los tabs usando componentes separados
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "datos":
        return (
          <DatosTab isEditing={isEditing} errors={errors} register={register} />
        );

      case "contacto":
        return (
          <ContactoTab
            isEditing={isEditing}
            errors={errors}
            register={register}
          />
        );

      case "adicionales":
        return (
          <AdicionalesTab
            isEditing={isEditing}
            errors={errors}
            register={register}
            watch={watch}
          />
        );

      default:
        return null;
    }
  }, [activeTab, isEditing, errors, register, watch]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header section */}
      <header className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative mb-6">
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>
        <div className="p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <Building2
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Administración de Empresa
                </h1>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Info
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline"
                    aria-hidden="true"
                  />
                  Gestiona la información corporativa de tu empresa
                </p>
              </div>
            </div>
            <button
              className={`w-full sm:w-auto transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500 ${
                isEditing
                  ? "bg-red-500/20 hover:bg-red-500/30 border border-red-400/30"
                  : "bg-white/20 hover:bg-white/30"
              }`}
              onClick={isEditing ? handleCancelImg : toggleEditing}
              type="button"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" aria-hidden="true" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
                  Editar Información
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 sm:p-6"
          noValidate
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <LogoSection
                logo={logo}
                defaultLogo={defaultLogo}
                isEditing={isEditing}
                isUpload={isUpload}
                onImageChange={handleImageChange}
              />
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  role="tabpanel"
                  id={`tabpanel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                >
                  {tabContent}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
              <button
                type="submit"
                disabled={isSubmitting || isUpload}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Save className="w-5 h-5" aria-hidden="true" />
                )}
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
