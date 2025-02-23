import { useState } from "react";
import { ArrowLeft, Loader2, Mail, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { recoverPassword } from "@/api/auth";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await recoverPassword({ email });
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
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 lg:p-10 bg-white dark:bg-gray-900  rounded-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-white">
              Recuperación de contraseña
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Ingresa tu correo electrónico y te enviaremos instrucciones para
              restablecer tu contraseña.
            </CardDescription>
          </CardHeader>

          {!isSubmitted ? (
            <form
              className="w-full max-w-md space-y-6 mt-6"
              onSubmit={handleSubmit}
            >
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Correo electrónico
                </Label>
                <div className="mt-2 relative">
                 
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar instrucciones
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <Alert className="w-full max-w-md mt-6 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <AlertTitle className="text-lg font-bold dark:text-gray-200">
                Instrucciones enviadas
              </AlertTitle>
              <AlertDescription className="mt-2 dark:text-gray-400">
                Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
                <span className="font-bold">{email}</span>. Por favor, revisa tu
                bandeja de entrada y sigue los pasos indicados.
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-sm text-center">
            <Link
              to={"/login"}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-600 dark:hover:text-blue-600 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
