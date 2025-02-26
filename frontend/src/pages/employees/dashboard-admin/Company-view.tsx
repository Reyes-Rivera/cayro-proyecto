/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CameraIcon,
  Edit,
  Save,
  X,
  Info,
  Phone,
  Book,
  Loader,
} from "lucide-react";
import { companyInfoUpdateApi, getCompanyInfoApi } from "@/api/company";
import { useAuth } from "@/context/AuthContextType";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

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

export function CompanyView() {
  const [activeTab, setActiveTab] = useState("datos");
  const [isEditing, setIsEditing] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [defaultLogo, setDefaultLogo] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isUpload, setIsUpload] = useState(false);
  const [id, setiD] = useState();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InfoCompany>();

  const handleCancelImg = () => {
    setImage(null);
    setIsUpload(false);
    setLogo(defaultLogo);
  };

  const uploadImageToCloudinary = async () => {
    setIsUpload(true);
    if (!image) return;
    console.log("object");
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
        confirmButtonColor: "#2F93D1",
      });
    } catch (error) {
      setIsUpload(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo subir la imagen, intenta nuevamente.",
        confirmButtonColor: "#2F93D1",
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
    if (!file) {
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2 MB
    const validTypes = ["image/png", "image/jpeg"];

    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Error en el envío.",
        text: "La imagen debe ser de 2 MB o menos.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    }

    // Validar el tipo de archivo
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Formato no válido",
        text: "La imagen debe ser en formato PNG o JPEG.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    }

    // Si pasa todas las validaciones, se establece la imagen
    setImage(file);
  };

  const toggleEditing = () => setIsEditing((prev) => !prev);

  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfoApi();
      try {
        const companyData = res.data[0];
        setLogo(companyData.logoUrl);
        setiD(companyData.id);
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
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<InfoCompany> = async (data) => {
    // console.log(da);
    try {
      const res = await companyInfoUpdateApi(
        { ...data, logoUrl: logo },
        Number(id),
        Number(user?.id)
      );
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Actualizado.",
          text: "Datos actualizados correctamente.",
          confirmButtonColor: "#2F93D1",
        });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error.",
        text: "Algo salió mal, intenta de nuevo.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    } catch (error) {
      navigate("/500", { state: { fromError: true } });
      toggleEditing();
    }
  };

  return (
    <div className="flex flex-col items-center sm:p-8 dark:bg-gray-900 dark:text-gray-100">
      {/* Tabs arriba */}
      <div className="w-full max-w-7xl">
        <div className="flex overflow-x-auto sm:justify-start">
          {[
            {
              id: "datos",
              label: "Datos de la Empresa",
              icon: <Info size={20} />,
            },
            {
              id: "contacto",
              label: "Contacto",
              icon: <Phone size={20} />,
            },
            {
              id: "adicionales",
              label: "Adicionales",
              icon: <Book size={20} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-8 py-4 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 border-b-4 border-blue-600 dark:border-blue-300 shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-900"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Formulario con fondo blanco */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 w-full max-w-7xl rounded-b-2xl rounded-r-2xl shadow-md p-6 sm:p-8 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
              Perfil de la Empresa
            </h2>
            <p className="text-center sm:text-left dark:text-gray-300">
              Administra la información y configuración de tu empresa.
            </p>
          </div>
          <Button
            type="button"
            className={`flex items-center gap-2 ${
              isEditing
                ? "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800"
                : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
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
                <X className="w-5 h-5" />
                Cancelar
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                Editar
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8 w-full">
          {/* Imagen responsiva */}
          <div className="flex w-full flex-col items-center justify-center lg:items-start space-y-4">
            <div className="relative w-full bg-gray-50/20 flex max-w-xs lg:max-w-full h-64 rounded-md overflow-hidden shadow-md">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo de la empresa"
                  className="w-full h-full object-contain lg:object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  Sin logo
                </div>
              )}

              {isUpload && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader className="w-10 h-10 animate-spin text-white" />
                </div>
              )}

              {isEditing && !isUpload && (
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <label
                    htmlFor="logoUpload"
                    className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <CameraIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
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
          </div>

          {/* Contenido dinámico */}
          <div className="col-span-3">
            {activeTab === "datos" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <input
                    id="companyName"
                    {...register("title", {
                      required: "El nombre es obligatorio",
                      pattern: {
                        value: /^[a-zA-Z\s.,;:!?'()-]{4,50}$/,
                        message:
                          "El nombre solo debe contener letras, espacios, y signos de puntuación (4-50 caracteres)",
                      },
                    })}
                    disabled={!isEditing}
                    className={`block w-full rounded-md p-3 ${
                      isEditing
                        ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  />

                  {errors.title && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan</Label>
                  <input
                    id="slogan"
                    {...register("slogan", {
                      required: "El slogan es obligatorio",
                      pattern: {
                        value: /^[a-zA-Z0-9\s.,!?-]{4,50}$/,
                        message:
                          "El slogan solo debe contener letras, números, espacios y caracteres como . , ! ? - (4-50 caracteres)",
                      },
                    })}
                    disabled={!isEditing}
                    className={`block w-full rounded-md p-3 ${
                      isEditing
                        ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  />

                  {errors.slogan && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errors.slogan.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "contacto" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <input
                    id="email"
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
                    className={`block w-full rounded-md p-3 ${
                      isEditing
                        ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  />

                  {errors.contactInfo?.[0]?.email && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errors.contactInfo[0].email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <input
                    id="phone"
                    {...register("contactInfo.0.phone", {
                      required: "El teléfono es obligatorio",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message:
                          "El teléfono debe contener exactamente 10 dígitos",
                      },
                    })}
                    disabled={!isEditing}
                    className={`block w-full rounded-md p-3 ${
                      isEditing
                        ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  />

                  {errors.contactInfo?.[0]?.phone && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errors.contactInfo[0].phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <textarea
                    id="address"
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
                    className={`block w-full rounded-md p-3 ${
                      isEditing
                        ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  />

                  {errors.contactInfo?.[0]?.address && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errors.contactInfo[0].address.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "adicionales" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mission">Misión</Label>
                  <textarea
                    rows={4}
                    id="mission"
                    {...register("mission", {
                      required: "La misión es obligatoria",
                      minLength: {
                        value: 10,
                        message: "La misión debe tener al menos 10 caracteres",
                      },
                      maxLength: {
                        value: 500,
                        message:
                          "La misión no puede tener más de 500 caracteres",
                      },
                    })}
                    disabled={!isEditing}
                    className={`block w-full rounded-md p-3 ${
                      isEditing
                        ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  />

                  {errors.mission && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errors.mission.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Visión</Label>
                  <textarea
                    rows={4}
                    id="vision"
                    {...register("vision", {
                      required: "La visión es obligatoria",
                      minLength: {
                        value: 10,
                        message: "La visión debe tener al menos 10 caracteres",
                      },
                      maxLength: {
                        value: 200,
                        message:
                          "La visión no puede tener más de 200 caracteres",
                      },
                    })}
                    disabled={!isEditing}
                    className={`block w-full rounded-md p-3 ${
                      isEditing
                        ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                        : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                    }`}
                  />

                  {errors.vision && (
                    <p className="text-red-500 dark:text-red-300 text-sm">
                      {errors.vision.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
