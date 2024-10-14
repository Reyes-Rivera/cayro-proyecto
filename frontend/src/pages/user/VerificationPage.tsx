import { useEffect, useState } from 'react';
import { Loader2, Send, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContextType';
import { useNavigate } from 'react-router-dom';
import { resendCodeApi } from '@/api/auth';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export default function VerificationPage() {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const { verifyCode, verifyCodeAuth, emailToVerify, isVerificationPending, setIsVerificationPending } = useAuth();

  const [message, setMessage] = useState('');

  const navigate = useNavigate();


  const handleCodeChange = (index: number, value: string) => {
    const newCode = [...verificationCode]
    newCode[index] = value

    // Si se ingresa un dígito, mover al siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement
      if (nextInput) nextInput.focus()
    }

    setVerificationCode(newCode)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!emailToVerify) {
      Swal.fire({
        icon: 'error',
        title: 'Correo no encontrado',
        text: 'Correo electrónico no encontrado. Por favor, intente nuevamente.',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }
    const code = verificationCode.join('');
    setIsSubmitting(true)

    if (location.pathname === '/verification-code') {
      console.log("Hola")
      const response = await await verifyCode(emailToVerify, code);
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: '¡Verificación Exitosa!',
          text: 'Tu código ha sido verificado correctamente. Serás redirigido en breve.',
          confirmButtonColor: '#2F93D1',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);// Redirigir a la página principal después de la verificación
        setIsVerificationPending(false); // Deshabilitar la verificación pendiente
        localStorage.removeItem('isVerificationPending');
        localStorage.removeItem('emailToVerify'); // Limpiar localStorage después de la verificación
        setIsVerified(true);
      } else {
        setMessage(response?.response?.data?.message);
        setTimeout(() => {
          setMessage("");
        }, 2000);
        setError('Código de verificación incorrecto. Por favor, inténtelo de nuevo.')
      }
    }

    if (location.pathname === '/verification-code-auth') {
      const response = await await verifyCodeAuth(emailToVerify, code);
      if (response.status === 201) {
        console.log("first")
        Swal.fire({
          icon: 'success',
          title: '¡Verificación Exitosa!',
          text: 'Tu código ha sido verificado correctamente. Serás redirigido en breve.',
          confirmButtonColor: '#2F93D1',
        });
        setTimeout(() => {
          setIsVerificationPending(false); // Deshabilitar la verificación pendiente
          localStorage.removeItem('isVerificationPending');
          localStorage.removeItem('emailToVerify'); // Limpiar localStorage después de la verificación
          setIsVerified(true);
          navigate('/user-profile');
        }, 2000);// Redirigir a la página principal después de la verificación

      } else {
        setMessage(response?.response?.data?.message);
        setTimeout(() => {
          setMessage("");
        }, 2000);
        setError('Código de verificación incorrecto. Por favor, inténtelo de nuevo.')
      }
    }
    setError('')
    setIsSubmitting(false)
  }

  const handleResendCode = async () => {
    try {
      const res = await resendCodeApi({ email: emailToVerify });
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Código reenviado',
          text: 'Se ha enviado un nuevo código de verificación.',
          confirmButtonColor: '#2F93D1',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al reenviar',
          text: 'Algo salió mal, intente más tarde.',
          confirmButtonColor: '#2F93D1',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo reenviar el código, intente más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Verificación de Código</CardTitle>
            <CardDescription className="text-center">
              Por favor, ingrese el código de 6 dígitos que hemos enviado a su correo electrónico.
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
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement
                          if (prevInput) {
                            prevInput.focus()
                          }
                        }
                      }}
                    />
                  ))}
                </div>
                {message && <p className='text-red-500 text-[12px] text-center'>{message}</p>}

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#2F93D1] hover:bg-[#007ACC]"
                  disabled={isSubmitting || verificationCode.some(digit => !digit)}
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
                    type='button'
                    variant="link"
                    onClick={handleResendCode}
                    className="text-[#0099FF] hover:text-[#007ACC]"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reenviar código
                  </Button>
                </div>
              </form>
            ) : (
              <Alert>
                <AlertTitle>¡Verificación Exitosa!</AlertTitle>
                <AlertDescription>
                  Su código ha sido verificado correctamente. Será redirigido en breve.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}