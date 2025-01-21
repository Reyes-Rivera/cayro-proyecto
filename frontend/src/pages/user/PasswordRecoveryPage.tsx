import { useState } from "react";
import { ArrowLeft, Loader2, Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import img from "../../assets/password-update.png";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { recoverPassword } from "@/api/auth";

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
          confirmButtonColor: "#2F93D1",
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal.",
          text: "Por favor, inténtalo más tarde.",
          confirmButtonColor: "#2F93D1",
        });
        return;
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al enviar.",
        text: error.response?.data?.message || "Error desconocido.",
        confirmButtonColor: "#2F93D1",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 ">
      {/* Contenido principal */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-4xl w-full ">
          <Card className=" dark:bg-gray-800 dark:text-gray-200 shadow-none border-none">
            <CardContent className="p-0">
              <div className="md:flex">
                {/* Columna izquierda - Fondo azul y diseño similar al login */}
                <div className="md:w-1/2 bg-blue-600  text-white p-10 dark:bg-gray-900 flex-col justify-center items-center rounded-l-lg hidden md:flex">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 mb-6">
                    <img
                      src={img}
                      alt="Recuperación de contraseña"
                      className="w-36 h-36 p-2 object-contain"
                    />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 text-center">
                    Recupera tu acceso a <br />
                    <span className="text-blue-100">Cayro Uniformes</span>
                  </h2>
                  <p className="text-lg text-center mb-6">
                    No te preocupes, te ayudaremos a recuperar tu contraseña en
                    unos sencillos pasos.
                  </p>
                </div>

                {/* Columna derecha - Formulario */}
                <div className="md:w-1/2 p-8 bg-white shadow-none dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-white">
                      Recuperación de contraseña
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                      Ingresa tu correo electrónico y te enviaremos
                      instrucciones para restablecer tu contraseña.
                    </CardDescription>
                  </CardHeader>

                  {!isSubmitted ? (
                    <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                      <div>
                        <Label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          Correo electrónico
                        </Label>
                        <div className="mt-2 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail
                              className="h-5 w-5 text-gray-400 dark:text-gray-300"
                              aria-hidden="true"
                            />
                          </div>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="pl-10 block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-600"
                            placeholder="tu@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-4 w-full text-center justify-center py-2 bg-blue-500 font-bold text-white rounded-md flex items-center"
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
                    <Alert className="mt-6 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <AlertTitle className="text-lg font-bold dark:text-gray-200">
                        Instrucciones enviadas
                      </AlertTitle>
                      <AlertDescription className="mt-2 dark:text-gray-400">
                        Hemos enviado las instrucciones para restablecer tu
                        contraseña a <span className="font-bold">{email}</span>.
                        Por favor, revisa tu bandeja de entrada y sigue los
                        pasos indicados.
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
