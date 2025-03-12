import { useState } from "react";
import { useForm } from "react-hook-form"; // Importar useForm
import { ArrowLeft, Loader2, Mail, ArrowRight, Lock, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { recoverPassword } from "@/api/auth";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { motion } from "framer-motion";

export default function PasswordRecoveryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Configurar react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  // Función para manejar el envío del formulario
  const onSubmit = async (data: { email: string }) => {
    try {
      setIsSubmitting(true);
      const res = await recoverPassword({ email: data.email });
      if (res) {
        setIsSubmitted(true);
        Swal.fire({
          icon: "success",
          title: "Recuperación de contraseña.",
          text: "Se ha enviado un correo con las instrucciones para la recuperación de su contraseña.",
          confirmButtonColor: "#2563EB",
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal.",
          text: "Por favor, inténtalo más tarde.",
          confirmButtonColor: "#2563EB",
        });
        return;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        navigate("/400");
      }
      navigate("/500", { state: { fromError: true } });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para evitar caracteres no permitidos
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[<>'"]/g, ""); // Eliminar <, >, ', "
    setValue("email", value); // Actualizar el valor del campo
  };

  return (
    <div className="flex p-10 md:p-0 min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Columna Izquierda con imagen de fondo */}
        <div
          className="hidden h-screen justify-center items-center md:flex md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          {/* Contenido de la columna izquierda */}
          <div className="relative z-10 p-10 text-white">
            <div className="text-white [&_*]:!text-white flex justify-center">
              <Breadcrumbs />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-center">
              Recupera tu acceso a <br />
              <span className="text-blue-100">Cayro Uniformes</span>
            </h2>
            <p className="text-lg text-center mb-6">
              No te preocupes, te ayudaremos a recuperar tu contraseña en unos
              sencillos pasos.
            </p>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <motion.div
          className="w-full md:w-1/2 bg-white dark:bg-gray-900 p-8 md:p-12 lg:p-24 flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-md mx-auto w-full">
            <CardHeader className="px-0 pt-0">
              <div className="md:hidden mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  Recupera tu acceso
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Te ayudaremos a recuperar tu contraseña
                </p>
              </div>

              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Recuperación de contraseña
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                Ingresa tu correo electrónico y te enviaremos instrucciones para
                restablecer tu contraseña.
              </CardDescription>
            </CardHeader>

            {!isSubmitted ? (
              <motion.form
                className="w-full space-y-6 mt-8"
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Correo electrónico
                  </Label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="tu@ejemplo.com"
                      className={`block w-full rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
                      } p-3.5 transition-all duration-200 outline-none`}
                      {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "El correo electrónico no es válido",
                        },
                      })}
                      onChange={handleEmailChange} // Evitar caracteres no permitidos
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Enviando instrucciones...
                    </>
                  ) : (
                    <>
                      Enviar instrucciones
                      <ArrowRight className="h-5 w-5 ml-1" />
                    </>
                  )}
                </motion.button>

                <div className="pt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Recibirás un correo con un enlace para crear una nueva
                    contraseña
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Alert className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <AlertTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Instrucciones enviadas
                      </AlertTitle>
                      <AlertDescription className="text-gray-700 dark:text-gray-300">
                        Hemos enviado las instrucciones para restablecer tu
                        contraseña a{" "}
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {email}
                        </span>
                        .
                        <p className="mt-2">
                          Por favor, revisa tu bandeja de entrada y sigue los
                          pasos indicados.
                        </p>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    ¿No recibiste el correo? Revisa tu carpeta de spam o
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Intentar con otro correo
                  </button>
                </div>
              </motion.div>
            )}

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver a iniciar sesión
              </Link>
            </div>
          </div>

          {/* Footer para móviles */}
          <div className="md:hidden mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Lock className="h-4 w-4" />
              <p>Tus datos están protegidos</p>
            </div>
            <p>
              © {new Date().getFullYear()} Cayro Uniformes. Todos los derechos
              reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}