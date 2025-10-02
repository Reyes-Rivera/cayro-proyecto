import React, { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  User,
  AtSign,
  Briefcase,
  FileText,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import FormError from "@/components/web-components/FormError";
import { REGEX, ERROR_MESSAGES } from "@/utils/FormValidation";
import { CompanyProfile } from "@/types/CompanyInfo";
import { getCompanyInfoApi } from "@/api/company";
import { AlertHelper } from "@/utils/alert.util";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  subject: string;
  message: string;
}

const ContactFormSection: React.FC = () => {
  const [info, setInfo] = useState<CompanyProfile>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      service: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    const getInfo = async () => {
      try {
        const res = await getCompanyInfoApi();
        if (!mounted) return;
        const first = Array.isArray(res?.data) ? res.data[0] : undefined;
        if (first) setInfo(first as CompanyProfile);
      } catch (err: any) {
        AlertHelper.error({
          title: "No se pudo cargar la información de contacto",
          message: err?.response?.data?.message || "Inténtalo más tarde.",
          animation: "slideIn",
          timer: 4000,
        });
      }
    };
    getInfo();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // TODO: sustituir por tu API real de contacto
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setIsSubmitted(true);
      reset();
      AlertHelper.success({
        title: "Formulario enviado",
        message: "Tu formulario se ha enviado correctamente.",
        animation: "slideIn",
        timer: 3000,
      });
    } catch (error: any) {
      AlertHelper.error({
        title: "Error al enviar el formulario",
        message:
          error?.response?.data?.message ||
          "No se pudo enviar el formulario. Intenta nuevamente.",
        animation: "slideIn",
        timer: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-full">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
          >
            ENVÍANOS UN MENSAJE
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Cuéntanos sobre tu <span className="text-blue-600">proyecto</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1 bg-blue-600 mx-auto mt-6"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 relative z-10">
            {/* Columna info empresa */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 p-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full" />
              </div>

              <div className="h-full flex flex-col relative z-10">
                <div className="mb-8">
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center justify-center rounded-full bg-blue-100/20 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-white"
                  >
                    👋 Trabajemos Juntos
                  </motion.span>
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-3xl lg:text-4xl font-bold mb-6"
                >
                  Cuéntanos sobre tu proyecto
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-blue-50 mb-8 lg:pr-6"
                >
                  Comparte tu visión para tus prendas personalizadas. Ya sea que
                  necesites playeras, polos, camisas, ropa deportiva, pantalones
                  o cualquier otra prenda, estamos aquí para ayudarte a hacerla
                  realidad.
                </motion.p>

                <div className="space-y-6 mb-auto">
                  <div className="flex items-center group">
                    <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span>
                      {info?.contactInfo?.[0]?.phone ?? "771 178 3587"}
                    </span>
                  </div>

                  <div className="flex items-center group">
                    <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span>
                      {info?.contactInfo?.[0]?.email ??
                        "cayrohuejutla@hotmail.com"}
                    </span>
                  </div>

                  <div className="flex items-center group">
                    <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span>
                      {info?.contactInfo?.[0]?.address ??
                        "Calle 16 de Enero #4-4 Col. Centro, Huejutla de Reyes, Mexico"}
                    </span>
                  </div>
                </div>

                <div className="mt-10 flex space-x-4 justify-start">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 transition-all hover:bg-white/20"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 transition-all hover:bg-white/20"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Columna formulario */}
            <motion.div
              className="lg:col-span-3 p-8 lg:p-12 relative z-10"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
                <MessageSquare className="w-7 h-7 mr-3 text-blue-600" />
                Envíanos un mensaje
              </h2>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Gracias por contactarnos. Te responderemos a la brevedad
                    posible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="col-span-1 space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Nombre
                    </label>
                    <input
                      id="firstName"
                      autoComplete="given-name"
                      {...register("firstName", {
                        required: ERROR_MESSAGES.required,
                        minLength: {
                          value: 2,
                          message: ERROR_MESSAGES.minLength(2),
                        },
                        maxLength: {
                          value: 50,
                          message: ERROR_MESSAGES.maxLength(50),
                        },
                        pattern: {
                          value: REGEX.NAME,
                          message: ERROR_MESSAGES.pattern,
                        },
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      placeholder="Tu nombre"
                      className={`w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border ${
                        errors.firstName
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } p-3 outline-none transition-all`}
                      aria-invalid={errors.firstName ? "true" : "false"}
                    />
                    <FormError message={errors.firstName?.message} />
                  </div>

                  <div className="col-span-1 space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Apellido
                    </label>
                    <input
                      id="lastName"
                      autoComplete="family-name"
                      {...register("lastName", {
                        required: ERROR_MESSAGES.required,
                        minLength: {
                          value: 2,
                          message: ERROR_MESSAGES.minLength(2),
                        },
                        maxLength: {
                          value: 50,
                          message: ERROR_MESSAGES.maxLength(50),
                        },
                        pattern: {
                          value: REGEX.NAME,
                          message: ERROR_MESSAGES.pattern,
                        },
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      placeholder="Tu apellido"
                      className={`w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border ${
                        errors.lastName
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } p-3 outline-none transition-all`}
                      aria-invalid={errors.lastName ? "true" : "false"}
                    />
                    <FormError message={errors.lastName?.message} />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <AtSign className="w-4 h-4 mr-2 text-blue-600" />
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email", {
                        required: ERROR_MESSAGES.required,
                        pattern: {
                          value: REGEX.EMAIL,
                          message: ERROR_MESSAGES.email,
                        },
                        validate: (value) =>
                          REGEX.NO_SQL_INJECTION.test(value) ||
                          ERROR_MESSAGES.sqlInjection,
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      placeholder="tu@correo.com"
                      className={`w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } p-3 outline-none transition-all`}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    <FormError message={errors.email?.message} />
                  </div>

                  <div className="col-span-1 space-y-2">
                    <label
                      htmlFor="service"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                      Servicio de interés
                    </label>
                    <input
                      id="service"
                      autoComplete="off"
                      {...register("service", {
                        required: ERROR_MESSAGES.required,
                        validate: (value) =>
                          REGEX.NO_SQL_INJECTION.test(value) ||
                          ERROR_MESSAGES.sqlInjection,
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      placeholder="Ej: Uniformes, Playeras, etc."
                      className={`w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border ${
                        errors.service
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } p-3 outline-none transition-all`}
                      aria-invalid={errors.service ? "true" : "false"}
                    />
                    <FormError message={errors.service?.message} />
                  </div>

                  <div className="col-span-1 space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2 text-blue-600" />
                      Asunto
                    </label>
                    <input
                      id="subject"
                      autoComplete="off"
                      {...register("subject", {
                        required: ERROR_MESSAGES.required,
                        validate: (value) =>
                          REGEX.NO_SQL_INJECTION.test(value) ||
                          ERROR_MESSAGES.sqlInjection,
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      placeholder="Asunto de tu mensaje"
                      className={`w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border ${
                        errors.subject
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } p-3 outline-none transition-all`}
                      aria-invalid={errors.subject ? "true" : "false"}
                    />
                    <FormError message={errors.subject?.message} />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register("message", {
                        required: ERROR_MESSAGES.required,
                        minLength: {
                          value: 10,
                          message: ERROR_MESSAGES.minLength(10),
                        },
                        validate: (value) =>
                          REGEX.NO_SQL_INJECTION.test(value) ||
                          ERROR_MESSAGES.sqlInjection,
                        setValueAs: (v) =>
                          typeof v === "string" ? v.trim() : v,
                      })}
                      placeholder="Cuéntanos sobre tu proyecto o consulta..."
                      className={`w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border ${
                        errors.message
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } p-3 outline-none transition-all resize-none`}
                      aria-invalid={errors.message ? "true" : "false"}
                    />
                    <FormError message={errors.message?.message} />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          <span>Enviando mensaje...</span>
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          <span>Enviar mensaje</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ContactFormSection);
