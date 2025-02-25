import { useState } from "react";
import { Loader2, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContextType";
import { useNavigate } from "react-router-dom";
import { resendCodeApi, resendCodeApiAuth } from "@/api/auth";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default function VerificationPage() {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false); // Nuevo estado para el reenvío
  const {
    verifyCode,
    verifyCodeAuth,
    emailToVerify,
    setIsVerificationPending,
  } = useAuth();

  const navigate = useNavigate();

  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...verificationCode];
    newCode[index] = value;

    // Si se ingresa un dígito, mover al siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `code-${index + 1}`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    setVerificationCode(newCode);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailToVerify) {
      Swal.fire({
        icon: "error",
        title: "Correo no encontrado",
        text: "Correo electrónico no encontrado. Por favor, intente nuevamente.",
        confirmButtonColor: "#2563EB",
        backdrop: "rgba(0,0,0,0.4)",
      });
      return;
    }

    const code = verificationCode.join("");
    setIsSubmitting(true);

    let response: any;

    try {
      if (location.pathname === "/codigo-verificacion") {
        response = await verifyCode(emailToVerify, code);
      } else if (location.pathname === "/codigo-verificacion-auth") {
        response = await verifyCodeAuth(emailToVerify, code);
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "¡Verificación Exitosa!",
            text: "Tu código ha sido verificado correctamente. Serás redirigido en breve.",
            confirmButtonColor: "#2563EB",
            backdrop: "rgba(0,0,0,0.4)",
          });

          setTimeout(() => {
            setIsVerificationPending(false);
            localStorage.removeItem("isVerificationPending");
            localStorage.removeItem("emailToVerify");
            setIsVerified(true);
            console.log("Entro");
            if (response.data?.role === "ADMIN") {
              navigate("/perfil-admin");
            } else if (response.data?.role === "USER") {
              navigate("/perfil-usuario");
            } else if (response.data?.role === "EMPLOYEE") {
              navigate("/perfil-empleado");
            }
          }, 2000);
        } else {
          throw new Error(response.message || "Error en la verificación");
        }
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message ||
        "Código de verificación incorrecto. Inténtelo de nuevo.";

      Swal.fire({
        icon: "error",
        title: "Error al verificar el código",
        text: errorMessage,
        confirmButtonColor: "#2563EB",
        backdrop: "rgba(0,0,0,0.4)",
      });
    }

    setIsSubmitting(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      if (location.pathname === "/codigo-verificacion") {
        const res = await resendCodeApi({ email: emailToVerify });
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Código reenviado",
            text: "Se ha enviado un nuevo código de verificación.",
            confirmButtonColor: "#2563EB",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al reenviar",
            text: "Algo salió mal, intente más tarde.",
            confirmButtonColor: "#2563EB",
          });
        }
      }

      if (location.pathname === "/codigo-verificacion-auth") {
        const res = await resendCodeApiAuth({ email: emailToVerify });
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Código reenviado",
            text: "Se ha enviado un nuevo código de verificación.",
            confirmButtonColor: "#2563EB",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al reenviar",
            text: "Algo salió mal, intente más tarde.",
            confirmButtonColor: "#2563EB",
          });
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo reenviar el código, intente más tarde.",
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setIsResending(false); // Desactivar el estado de carga
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Verificación de Código
            </CardTitle>
            <CardDescription className="text-center">
              Por favor, ingrese el código de 6 dígitos que hemos enviado a su
              correo electrónico.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isVerified ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-2xl"
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          const prevInput = document.getElementById(
                            `code-${index - 1}`
                          ) as HTMLInputElement;
                          if (prevInput) {
                            prevInput.focus();
                          }
                        }
                      }}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex justify-center"
                  disabled={
                    isSubmitting || verificationCode.some((digit) => !digit)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Verificar Código
                    </>
                  )}
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendCode}
                    className="text-blue-600 p-3"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reenviar código
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <Alert>
                <AlertTitle>¡Verificación Exitosa!</AlertTitle>
                <AlertDescription>
                  Su código ha sido verificado correctamente. Será redirigido en
                  breve.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
