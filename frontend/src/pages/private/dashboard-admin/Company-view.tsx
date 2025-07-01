"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
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

const tabConfig = [
  {
    id: "datos",
    label: "Datos de la Empresa",
    icon: <Building2 size={18} />,
  },
  {
    id: "contacto",
    label: "Información de Contacto",
    icon: <Phone size={18} />,
  },
  {
    id: "adicionales",
    label: "Filosofía Corporativa",
    icon: <Book size={18} />,
  },
];

export function CompanyView() {
  const [activeTab, setActiveTab] = useState("datos");
  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [defaultLogo, setDefaultLogo] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isUpload, setIsUpload] = useState(false);
  const [id, setId] = useState();

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InfoCompany>();

  const handleCancelImg = () => {
    setImage(null);
    setIsUpload(false);
    setLogo(defaultLogo);
  };

  const uploadImageToCloudinary = async () => {
    setIsUpload(true);
    if (!image) return;

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
      const data = await response.json();
      setLogo(data.secure_url);
      setIsUpload(false);
      Swal.fire({
        icon: "success",
        title: "Imagen subida",
        text: "El logo ha sido actualizado correctamente.",
        confirmButtonColor: "#2563EB",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.log(error);
      setIsUpload(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo subir la imagen, intenta nuevamente.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  useEffect(() => {
    if (image) {
      uploadImageToCloudinary();
    }
  }, [image]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2 MB
    const validTypes = ["image/png", "image/jpeg"];

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Error en el envío.",
        text: "La imagen debe ser de 2 MB o menos.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no válido",
        text: "La imagen debe ser en formato PNG o JPEG.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    setImage(file);
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

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
        console.error(error);
      }
    };
    getInfo();
  }, [setValue]);

  const onSubmit: SubmitHandler<InfoCompany> = async (data) => {
    try {
      const res = await companyInfoUpdateApi(
        { ...data, logoUrl: logo },
        Number(id),
        Number(user?.id)
      );
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "Datos actualizados correctamente.",
          confirmButtonColor: "#2563EB",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setIsEditing(false);
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Algo salió mal, intenta de nuevo.",
        confirmButtonColor: "#2563EB",
      });
    } catch (error) {
      console.log(error);
      navigate("/500", { state: { fromError: true } });
      toggleEditing();
    }
  };

  return (
    <div className="px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header section */}
      <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative mb-6">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>

        <div className="p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Administración de Empresa
                </h2>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                  Gestiona la información corporativa de tu empresa
                </p>
              </div>
            </div>

            <button
              className={`w-full sm:w-auto transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center ${
                isEditing
                  ? "bg-red-500/20 hover:bg-red-500/30 border border-red-400/30"
                  : "bg-white/20 hover:bg-white/30"
              }`}
              onClick={() => {
                if (isEditing) {
                  handleCancelImg();
                  toggleEditing();
                  return;
                }
                toggleEditing();
              }}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Información
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
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
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  {logo ? (
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="Logo de la empresa"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 dark:text-gray-400">
                      <Building2 className="w-16 h-16 mb-2 opacity-50" />
                      <span className="text-sm">Sin logo</span>
                    </div>
                  )}

                  {isUpload && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="bg-white/20 p-4 rounded-full">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      </div>
                    </div>
                  )}

                  {isEditing && !isUpload && (
                    <div className="absolute bottom-3 right-3">
                      <label
                        htmlFor="logoUpload"
                        className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full shadow-lg cursor-pointer transition-colors"
                      >
                        <CameraIcon className="w-5 h-5 text-white" />
                      </label>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  id="logoUpload"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={!isEditing || isUpload}
                />

                {/* Logo Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Información del Logo
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Formato: PNG o JPEG</li>
                    <li>• Tamaño máximo: 2MB</li>
                    <li>• Resolución recomendada: 512x512px</li>
                  </ul>
                </div>
              </div>
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
                >
                  {activeTab === "datos" && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Identidad Corporativa
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {/* Nombre de la Empresa */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Building2 className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                              Nombre de la Empresa *
                            </label>
                            <input
                              {...register("title", {
                                required: "El nombre es obligatorio",
                                pattern: {
                                  value: /^[a-zA-Z\s.,;:!?'()-]{4,50}$/,
                                  message:
                                    "El nombre solo debe contener letras, espacios, y signos de puntuación (4-50 caracteres)",
                                },
                              })}
                              disabled={!isEditing}
                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                isEditing
                                  ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                  : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                              } ${
                                errors.title
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              placeholder="Ej: Mi Empresa S.A. de C.V."
                            />
                            {errors.title && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.title.message}
                              </p>
                            )}
                          </div>

                          {/* Slogan */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <MessageSquareQuote className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                              Slogan *
                            </label>
                            <input
                              {...register("slogan", {
                                required: "El slogan es obligatorio",
                                pattern: {
                                  value: /^[a-zA-Z0-9\s.,!?-]{4,50}$/,
                                  message:
                                    "El slogan solo debe contener letras, números, espacios y caracteres como . , ! ? - (4-50 caracteres)",
                                },
                              })}
                              disabled={!isEditing}
                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                isEditing
                                  ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                  : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                              } ${
                                errors.slogan
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              placeholder="Ej: Innovación que transforma"
                            />
                            {errors.slogan && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.slogan.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "contacto" && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Información de Contacto
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Mail className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                              Correo Electrónico *
                            </label>
                            <input
                              type="email"
                              {...register("contactInfo.0.email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Formato de correo inválido",
                                },
                                maxLength: {
                                  value: 200,
                                  message:
                                    "El correo no puede tener más de 200 caracteres",
                                },
                              })}
                              disabled={!isEditing}
                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                isEditing
                                  ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                  : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                              } ${
                                errors.contactInfo?.[0]?.email
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              placeholder="contacto@miempresa.com"
                            />
                            {errors.contactInfo?.[0]?.email && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.contactInfo[0].email.message}
                              </p>
                            )}
                          </div>

                          {/* Teléfono */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Phone className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                              Teléfono *
                            </label>
                            <input
                              type="tel"
                              {...register("contactInfo.0.phone", {
                                required: "El teléfono es obligatorio",
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message:
                                    "El teléfono debe contener exactamente 10 dígitos",
                                },
                              })}
                              disabled={!isEditing}
                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                isEditing
                                  ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                  : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                              } ${
                                errors.contactInfo?.[0]?.phone
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              placeholder="5512345678"
                            />
                            {errors.contactInfo?.[0]?.phone && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.contactInfo[0].phone.message}
                              </p>
                            )}
                          </div>

                          {/* Dirección */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <MapPin className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                              Dirección *
                            </label>
                            <textarea
                              rows={3}
                              {...register("contactInfo.0.address", {
                                required: "La dirección es obligatoria",
                                minLength: {
                                  value: 10,
                                  message:
                                    "La dirección debe tener al menos 10 caracteres",
                                },
                                maxLength: {
                                  value: 200,
                                  message:
                                    "La dirección no puede tener más de 200 caracteres",
                                },
                              })}
                              disabled={!isEditing}
                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                                isEditing
                                  ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                  : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                              } ${
                                errors.contactInfo?.[0]?.address
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              placeholder="Calle Principal #123, Colonia Centro, Ciudad, CP 12345"
                            />
                            {errors.contactInfo?.[0]?.address && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.contactInfo[0].address.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "adicionales" && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Filosofía Corporativa
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {/* Misión */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Target className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                              Misión *
                            </label>
                            <textarea
                              rows={4}
                              {...register("mission", {
                                required: "La misión es obligatoria",
                                minLength: {
                                  value: 10,
                                  message:
                                    "La misión debe tener al menos 10 caracteres",
                                },
                                maxLength: {
                                  value: 500,
                                  message:
                                    "La misión no puede tener más de 500 caracteres",
                                },
                              })}
                              disabled={!isEditing}
                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                                isEditing
                                  ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                  : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                              } ${
                                errors.mission
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              placeholder="Describe el propósito fundamental de tu empresa..."
                            />
                            {errors.mission && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.mission.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Caracteres: {watch("mission")?.length || 0}/500
                            </p>
                          </div>

                          {/* Visión */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              <Lightbulb className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                              Visión *
                            </label>
                            <textarea
                              rows={4}
                              {...register("vision", {
                                required: "La visión es obligatoria",
                                minLength: {
                                  value: 10,
                                  message:
                                    "La visión debe tener al menos 10 caracteres",
                                },
                                maxLength: {
                                  value: 200,
                                  message:
                                    "La visión no puede tener más de 200 caracteres",
                                },
                              })}
                              disabled={!isEditing}
                              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none ${
                                isEditing
                                  ? "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                  : "bg-gray-100 dark:bg-gray-600 border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                              } ${
                                errors.vision
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }`}
                              placeholder="Describe hacia dónde se dirige tu empresa en el futuro..."
                            />
                            {errors.vision && (
                              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.vision.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Caracteres: {watch("vision")?.length || 0}/200
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md"
              >
                <Save className="w-5 h-5" />
                Guardar Cambios
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
