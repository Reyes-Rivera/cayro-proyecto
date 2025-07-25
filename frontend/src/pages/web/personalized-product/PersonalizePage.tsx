"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Shirt,
  User,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Package,
  Hash,
  FileText,
} from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import img from "./assets/personalize.jpg";
import { AlertHelper } from "@/utils/alert.util";
interface FormData {
  productType: string;
  gender: string;
  size: string;
  quantity: number;
  specialRequests: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function PersonalizePage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      productType: "",
      gender: "", // Change from [] to ""
      size: "", // Change from [] to ""
      quantity: 1,
      specialRequests: "",
      contactInfo: {
        name: "",
        phone: "",
        email: "",
      },
    },
  });

  const watchedValues = watch();

  const productTypes = [
    { id: "playera", name: "Playera", icon: "👕" },
    { id: "polo", name: "Polo", icon: "👔" },
    { id: "camisa", name: "Camisa", icon: "👔" },
    { id: "pantalon", name: "Pantalón", icon: "👖" },
    { id: "sudadera", name: "Sudadera", icon: "🧥" },
    { id: "otro", name: "Otro", icon: "👕" },
  ];

  const genders = [
    { id: "hombre", name: "Hombre" },
    { id: "mujer", name: "Mujer" },
    { id: "unisex", name: "Unisex" },
  ];

  const sizes = [
    { id: "xs", name: "XS" },
    { id: "s", name: "S" },
    { id: "m", name: "M" },
    { id: "l", name: "L" },
    { id: "xl", name: "XL" },
    { id: "xxl", name: "XXL" },
  ];

  const handleGenderSelect = (genderId: string) => {
    setValue("gender", genderId);
  };

  const handleSizeSelect = (sizeId: string) => {
    setValue("size", sizeId);
  };

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsFormVisible(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "30px" }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const generateWhatsAppMessage = (data: FormData) => {
    const selectedProductType =
      productTypes.find((p) => p.id === data.productType)?.name ||
      "No especificado";
    const selectedGender =
      genders.find((g) => g.id === data.gender)?.name || "No especificado";
    const selectedSize =
      sizes.find((s) => s.id === data.size)?.name || "No especificado";

    const message = `🎨 *SOLICITUD DE PERSONALIZACIÓN*

👤 *Datos del Cliente:*
• Nombre: ${data.contactInfo.name}
• Teléfono: ${data.contactInfo.phone}
• Email: ${data.contactInfo.email || "No proporcionado"}

👕 *Detalles del Producto:*
• Tipo: ${selectedProductType}
• Género: ${selectedGender}
• Talla: ${selectedSize}
• Cantidad: ${data.quantity} ${data.quantity === 1 ? "pieza" : "piezas"}

📝 *Solicitudes Especiales:*
${data.specialRequests || "Ninguna"}

📸 *Nota Importante:*
Por favor, envía las imágenes de referencia del diseño que quieres personalizar junto con este mensaje. Las imágenes deben mostrar claramente los colores y detalles del diseño deseado.

---
*Solicitud generada desde la página de personalización*`;

    return encodeURIComponent(message);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const message = generateWhatsAppMessage(data);
    const whatsappUrl = `https://wa.me/527717759293?text=${message}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);

    // Show success message with SweetAlert
    AlertHelper.success({
      title: "Solicitud enviada",
      message:
        "Tu solicitud se ha enviado correctamente. En breve te contactaremos.",
      animation: "slideIn",
      timer: 5000,
    });
  };

  const isStepValid = async (step: number) => {
    switch (step) {
      case 1:
        return await trigger(["productType", "gender", "size", "quantity"]);
      case 2:
        return await trigger(["specialRequests"]);
      case 3:
        return await trigger(["contactInfo.name", "contactInfo.phone"]);
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    const valid = await isStepValid(currentStep);
    if (valid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Show validation error with SweetAlert
      AlertHelper.error({
        title: "Error",
        message: "Por favor, completa todos los campos requeridos.",
        animation: "slideIn",
        timer: 5000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section - Simplified design */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] bg-white dark:bg-gray-900 flex items-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50/50 dark:from-blue-900/10 to-transparent"></div>

          {/* Dots pattern */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500/30 rounded-full"></div>
            <div className="absolute top-40 left-40 w-3 h-3 bg-blue-500/20 rounded-full"></div>
            <div className="absolute top-60 left-60 w-2 h-2 bg-blue-500/30 rounded-full"></div>
            <div className="absolute top-20 right-40 w-3 h-3 bg-blue-500/20 rounded-full"></div>
            <div className="absolute top-60 right-60 w-2 h-2 bg-blue-500/30 rounded-full"></div>
          </div>
        </div>

        <div className=" mx-auto  py-12 md:py-16 lg:py-24 relative z-10">
          <div
            className={` container px-4 mx-auto transition-all duration-700 ease-out ${
              isHeaderVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
            ref={headerRef}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                {/* Badge Component */}
                <div className="flex items-center justify-center lg:justify-start mb-6 md:mb-8">
                  <div className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5">
                    <Shirt className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      DISEÑA TU PRENDA IDEAL
                    </span>
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
                  Crea tu{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-blue-600 dark:text-blue-400">
                      diseño
                    </span>
                    <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
                  </span>{" "}
                  único
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8">
                  Personaliza tu ropa con nuestro servicio especializado.
                  Completa el formulario y envía tus imágenes de referencia por
                  WhatsApp.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Especifica detalles
                    </span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Completa formulario
                    </span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Envía por WhatsApp
                    </span>
                  </div>
                </div>

                {/* Breadcrumbs at bottom */}
                <div className="mt-8">
                  <Breadcrumbs />
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={img}
                    alt="Personalización de ropa"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div
            ref={formRef}
            className={`transition-all duration-700 ease-out ${
              isFormVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {/* Progress Steps */}
            <div className="mb-8 md:mb-12">
              <div className="flex items-center justify-between max-w-lg mx-auto">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        currentStep >= step
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                      }`}
                    >
                      {currentStep > step ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 md:w-20 h-1 mx-2 transition-all ${
                          currentStep > step
                            ? "bg-blue-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  {currentStep === 1 && "Detalles del Producto"}
                  {currentStep === 2 && "Descripción y Solicitudes"}
                  {currentStep === 3 && "Información de Contacto"}
                </h3>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                {/* Step 1: Product Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <Shirt className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Detalles del producto
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Selecciona el tipo de prenda, género, talla y cantidad
                      </p>
                    </div>

                    {/* Product Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Tipo de Producto *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {productTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setValue("productType", type.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${
                              watchedValues.productType === type.id
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                : "border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <div className="text-2xl mb-2">{type.icon}</div>
                            <div className="font-medium">{type.name}</div>
                          </button>
                        ))}
                      </div>
                      {errors.productType && (
                        <p className="text-red-500 text-sm mt-1">
                          Selecciona un tipo de producto
                        </p>
                      )}
                      <input
                        type="hidden"
                        {...register("productType", {
                          required: "Selecciona un tipo de producto",
                        })}
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Género *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {genders.map((gender) => (
                          <button
                            key={gender.id}
                            type="button"
                            onClick={() => handleGenderSelect(gender.id)}
                            className={`p-3 rounded-xl border-2 transition-all text-center font-medium ${
                              watchedValues.gender === gender.id
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                : "border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {gender.name}
                          </button>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                          Selecciona un género
                        </p>
                      )}
                      <input
                        type="hidden"
                        {...register("gender", {
                          required: "Selecciona un género",
                        })}
                      />
                    </div>

                    {/* Size and Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Talla *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {sizes.map((size) => (
                            <button
                              key={size.id}
                              type="button"
                              onClick={() => handleSizeSelect(size.id)}
                              className={`p-3 rounded-xl border-2 transition-all text-center font-bold ${
                                watchedValues.size === size.id
                                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {size.name}
                            </button>
                          ))}
                        </div>
                        {errors.size && (
                          <p className="text-red-500 text-sm mt-1">
                            Selecciona una talla
                          </p>
                        )}
                        <input
                          type="hidden"
                          {...register("size", {
                            required: "Selecciona una talla",
                          })}
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                        >
                          Cantidad *
                        </label>
                        <div className="flex items-center gap-3">
                          <Hash className="w-5 h-5 text-gray-400" />
                          <input
                            id="quantity"
                            type="number"
                            min="1"
                            max="100"
                            {...register("quantity", {
                              required: "La cantidad es requerida",
                              min: {
                                value: 1,
                                message: "La cantidad mínima es 1",
                              },
                              max: {
                                value: 100,
                                message: "La cantidad máxima es 100",
                              },
                            })}
                            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="1"
                          />
                        </div>
                        {errors.quantity && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.quantity.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Description and Special Requests */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Descripción y solicitudes
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Describe los detalles específicos de tu diseño
                        personalizado
                      </p>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label
                        htmlFor="specialRequests"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                      >
                        Descripción del Diseño y Solicitudes Especiales
                      </label>
                      <textarea
                        id="specialRequests"
                        {...register("specialRequests")}
                        placeholder="Describe detalladamente el diseño que quieres personalizar. Incluye información sobre colores, ubicación del diseño, tamaño, texto específico, etc. Ejemplo: 'Logo de la empresa en el pecho izquierdo, colores azul y blanco, texto 'Mi Empresa' debajo del logo en letra Arial'..."
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none min-h-[120px]"
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Sé lo más específico posible para obtener mejores
                        resultados
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                            Información importante sobre colores:
                          </h5>
                          <p className="text-sm text-blue-800 dark:text-blue-400">
                            Los colores se especificarán en la descripción y se
                            confirmarán con las imágenes de referencia que
                            envíes por WhatsApp. Esto nos permite asegurar la
                            máxima precisión en tu diseño personalizado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Información de contacto
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Proporciona tus datos para que podamos contactarte
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Nombre Completo *
                        </label>
                        <input
                          id="name"
                          type="text"
                          {...register("contactInfo.name", {
                            required: "El nombre es requerido",
                            minLength: {
                              value: 2,
                              message:
                                "El nombre debe tener al menos 2 caracteres",
                            },
                          })}
                          placeholder="Tu nombre completo"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        {errors.contactInfo?.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.contactInfo.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Teléfono *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          {...register("contactInfo.phone", {
                            required: "El teléfono es requerido",
                            pattern: {
                              value: /^[0-9+\-\s()]+$/,
                              message: "Formato de teléfono inválido",
                            },
                            minLength: {
                              value: 10,
                              message:
                                "El teléfono debe tener al menos 10 dígitos",
                            },
                          })}
                          placeholder="Tu número de teléfono"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        {errors.contactInfo?.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.contactInfo.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email (Opcional)
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("contactInfo.email", {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Formato de email inválido",
                          },
                        })}
                        placeholder="tu@email.com"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      {errors.contactInfo?.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactInfo.email.message}
                        </p>
                      )}
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-green-900 dark:text-green-300 mb-1">
                            ¿Cómo funciona el envío?
                          </h5>
                          <p className="text-sm text-green-800 dark:text-green-400 mb-2">
                            Al completar el formulario, se generará un mensaje
                            de WhatsApp con todos los detalles.
                          </p>
                          <p className="text-sm text-green-800 dark:text-green-400 font-medium">
                            📸 Importante: Deberás enviar las imágenes de
                            referencia manualmente en el chat de WhatsApp para
                            completar tu solicitud.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentStep((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentStep === 1}
                    className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Anterior
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Enviar por WhatsApp
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
