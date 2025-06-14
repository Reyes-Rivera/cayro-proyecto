"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  X,
  Palette,
  Shirt,
  User,
  MessageCircle,
  Camera,
  FileImage,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface PersonalizationData {
  referenceImages: {
    front: File | null;
    back: File | null;
  };
  productType: string;
  gender: string;
  size: string;
  colors: string[];
  specialRequests: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

interface ImagePreview {
  file: File;
  url: string;
}

export default function PersonalizePage() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PersonalizationData>({
    referenceImages: { front: null, back: null },
    productType: "",
    gender: "",
    size: "",
    colors: [],
    specialRequests: "",
    contactInfo: { name: "", phone: "", email: "" },
  });
  const [imagePreviews, setImagePreviews] = useState<{
    front: ImagePreview | null;
    back: ImagePreview | null;
  }>({ front: null, back: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

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

  const availableColors = [
    { id: "negro", name: "Negro", hex: "#000000" },
    { id: "blanco", name: "Blanco", hex: "#FFFFFF" },
    { id: "azul", name: "Azul", hex: "#3B82F6" },
    { id: "rojo", name: "Rojo", hex: "#EF4444" },
    { id: "verde", name: "Verde", hex: "#10B981" },
    { id: "amarillo", name: "Amarillo", hex: "#F59E0B" },
    { id: "rosa", name: "Rosa", hex: "#EC4899" },
    { id: "gris", name: "Gris", hex: "#6B7280" },
  ];

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

  const handleImageUpload = (type: "front" | "back", file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [type]: { file, url },
      }));
      setFormData((prev) => ({
        ...prev,
        referenceImages: {
          ...prev.referenceImages,
          [type]: file,
        },
      }));
    }
  };

  const removeImage = (type: "front" | "back") => {
    if (imagePreviews[type]) {
      URL.revokeObjectURL(imagePreviews[type]!.url);
    }
    setImagePreviews((prev) => ({
      ...prev,
      [type]: null,
    }));
    setFormData((prev) => ({
      ...prev,
      referenceImages: {
        ...prev.referenceImages,
        [type]: null,
      },
    }));
  };

  const handleColorToggle = (colorId: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorId)
        ? prev.colors.filter((c) => c !== colorId)
        : [...prev.colors, colorId],
    }));
  };

  const generateWhatsAppMessage = () => {
    const { productType, gender, size, colors, specialRequests, contactInfo } =
      formData;

    const selectedProductType =
      productTypes.find((p) => p.id === productType)?.name || "No especificado";
    const selectedGender =
      genders.find((g) => g.id === gender)?.name || "No especificado";
    const selectedSize =
      sizes.find((s) => s.id === size)?.name || "No especificado";
    const selectedColors =
      colors
        .map((c) => availableColors.find((ac) => ac.id === c)?.name)
        .join(", ") || "No especificado";

    const message = `🎨 *SOLICITUD DE PERSONALIZACIÓN*

👤 *Datos del Cliente:*
• Nombre: ${contactInfo.name}
• Teléfono: ${contactInfo.phone}
• Email: ${contactInfo.email}

👕 *Detalles del Producto:*
• Tipo: ${selectedProductType}
• Género: ${selectedGender}
• Talla: ${selectedSize}
• Colores: ${selectedColors}

📝 *Solicitudes Especiales:*
${specialRequests || "Ninguna"}

📸 *Imágenes de Referencia:*
${
  formData.referenceImages.front
    ? "✅ Imagen frontal adjunta"
    : "❌ Sin imagen frontal"
}
${
  formData.referenceImages.back
    ? "✅ Imagen trasera adjunta"
    : "❌ Sin imagen trasera"
}

---
*Solicitud generada desde la página de personalización*`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/527717759293?text=${message}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);

    // Show success message
    alert(
      "¡Solicitud enviada! Te redirigiremos a WhatsApp para completar el envío de las imágenes."
    );
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.referenceImages.front !== null ||
          formData.referenceImages.back !== null
        );
      case 2:
        return (
          formData.productType !== "" &&
          formData.gender !== "" &&
          formData.size !== ""
        );
      case 3:
        return formData.colors.length > 0;
      case 4:
        return (
          formData.contactInfo.name !== "" && formData.contactInfo.phone !== ""
        );
      default:
        return false;
    }
  };

  const canProceedToNext = () => {
    return isStepComplete(currentStep);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
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

        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative z-10">
          <div
            ref={headerRef}
            className={`max-w-4xl mx-auto text-center transition-all duration-700 ease-out ${
              isHeaderVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
              <NavLink to="/" className="hover:text-blue-600 transition-colors">
                Inicio
              </NavLink>
              <span>/</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Personalizar
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight px-4">
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
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Personaliza tu ropa con nuestro servicio especializado. Sube tus
              imágenes de referencia y nosotros nos encargamos del resto.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto px-4">
              <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                <Camera className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Sube tus imágenes
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                <Palette className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Elige características
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Envía por WhatsApp
                </span>
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
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        currentStep >= step
                          ? "bg-blue-600 text-white"
                          : isStepComplete(step)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                      }`}
                    >
                      {isStepComplete(step) && currentStep > step ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 4 && (
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
                  {currentStep === 1 && "Imágenes de Referencia"}
                  {currentStep === 2 && "Detalles del Producto"}
                  {currentStep === 3 && "Colores y Personalización"}
                  {currentStep === 4 && "Información de Contacto"}
                </h3>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              {/* Step 1: Image Upload */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <FileImage className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Sube tus imágenes de referencia
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sube imágenes del frente y/o parte trasera del diseño que
                      quieres personalizar
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Front Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Imagen Frontal
                      </label>
                      <div className="relative">
                        {imagePreviews.front ? (
                          <div className="relative group">
                            <img
                              src={
                                imagePreviews.front.url || "/placeholder.svg"
                              }
                              alt="Vista frontal"
                              className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
                            />
                            <button
                              onClick={() => removeImage("front")}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Haz clic para subir imagen frontal
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload("front", file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Back Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Imagen Trasera
                      </label>
                      <div className="relative">
                        {imagePreviews.back ? (
                          <div className="relative group">
                            <img
                              src={imagePreviews.back.url || "/placeholder.svg"}
                              alt="Vista trasera"
                              className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
                            />
                            <button
                              onClick={() => removeImage("back")}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Haz clic para subir imagen trasera
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload("back", file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                          Consejos para mejores resultados:
                        </h5>
                        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                          <li>
                            • Usa imágenes de alta calidad y bien iluminadas
                          </li>
                          <li>
                            • Asegúrate de que el diseño sea claramente visible
                          </li>
                          <li>
                            • Puedes subir solo una imagen si no tienes ambas
                            vistas
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Product Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Shirt className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Detalles del producto
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Selecciona el tipo de prenda, género y talla
                    </p>
                  </div>

                  {/* Product Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tipo de Producto
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {productTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              productType: type.id,
                            }))
                          }
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            formData.productType === type.id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium">{type.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Género
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {genders.map((gender) => (
                        <button
                          key={gender.id}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              gender: gender.id,
                            }))
                          }
                          className={`p-3 rounded-xl border-2 transition-all text-center font-medium ${
                            formData.gender === gender.id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {gender.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Talla
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, size: size.id }))
                          }
                          className={`p-3 rounded-xl border-2 transition-all text-center font-bold ${
                            formData.size === size.id
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Colors and Customization */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Palette className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Colores y personalización
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Selecciona los colores que prefieres y añade solicitudes
                      especiales
                    </p>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Colores Preferidos (puedes seleccionar varios)
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {availableColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => handleColorToggle(color.id)}
                          className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                            formData.colors.includes(color.id)
                              ? "border-blue-600 scale-110"
                              : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {formData.colors.includes(color.id) && (
                            <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-blue-600 bg-white rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Colores seleccionados: {formData.colors.length}
                    </p>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Solicitudes Especiales (Opcional)
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specialRequests: e.target.value,
                        }))
                      }
                      placeholder="Describe cualquier detalle especial, modificaciones o instrucciones adicionales..."
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Contact Information */}
              {currentStep === 4 && (
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.contactInfo.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              name: e.target.value,
                            },
                          }))
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.contactInfo.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              phone: e.target.value,
                            },
                          }))
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Tu número de teléfono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email (Opcional)
                    </label>
                    <input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactInfo: {
                            ...prev.contactInfo,
                            email: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-green-900 dark:text-green-300 mb-1">
                          ¿Cómo funciona el envío?
                        </h5>
                        <p className="text-sm text-green-800 dark:text-green-400">
                          Al completar el formulario, se generará un mensaje de
                          WhatsApp con todos los detalles. Las imágenes deberás
                          enviarlas manualmente en el chat de WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() =>
                    setCurrentStep((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentStep === 1}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Anterior
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={!canProceedToNext()}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceedToNext() || isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        Enviar por WhatsApp
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
