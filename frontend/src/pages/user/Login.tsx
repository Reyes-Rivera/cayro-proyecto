import { resendCodeApi } from "@/api/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContextType";
import { UserLogin } from "@/types/User";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import ReCAPTCHA from 'react-google-recaptcha';
import img from "@/assets/login.png";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, error, errorTimer } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [data, setData] = useState<UserLogin>({
    email: "",
    password: "",
  });
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!captchaToken) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error en el envio.',
    //     text: 'Por favor, verifica que no eres un robot.',
    //     confirmButtonColor: '#2F93D1',
    //   });
    //   return;
    // }
    try {
      setIsLoading(true);
      const res = await login(data.email, data.password);
      if (res) {
        if (res?.role === "USER" && res.active === false) {
          setIsLoading(true);
          await resendCodeApi({ email: res.email });
          navigate("/verification-code");
        } else {
          navigate("/verification-code-auth");
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorTimer.includes('Cuenta bloqueada temporalmente')) {
      const timeMatch = errorTimer.match(/(\d+) minutos? y (\d+) segundos/);
      const timeMatch2 = errorTimer.match(/(\d+) segundos/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1], 10);
        const seconds = parseInt(timeMatch[2], 10);
        setLockoutTime(minutes * 60 + seconds);
      } else if (timeMatch2) {
        const seconds = parseInt(timeMatch2[1], 10);
        setLockoutTime(seconds);
      }
    }
  }, [errorTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-grow justify-center items-center">
        {/* Left column - Image container */}
        <div className="hidden w-1/2 flex-col lg:flex lg:items-center lg:justify-center">
          <div className="relative h-3/4 w-3/4 flex flex-col justify-center items-center">
            <img
              src={img}
              alt="Uniformes ilustración"
              className="dark:filter dark:drop-shadow-white"
            />
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Bienvenido a Cayro Uniformes
            </p>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Accede a tu cuenta para gestionar tus pedidos, ver tu historial de compras y mucho más.
            </p>
          </div>
        </div>

        {/* Right column - Form container */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
          <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-2xl transition-colors duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Iniciar sesión
              </h2>
            </div>
            <Button onClick={signInWithGoogle} variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13183_10121)">
                  <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8" />
                  <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006Z" fill="#34A853" />
                  <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04" />
                  <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_13183_10121">
                    <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              Iniciar sesión con Google
            </Button>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    O continúa con
                  </span>
                </div>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-[#2F93D1] focus:border-[#2F93D1] focus:z-10 sm:text-sm mt-1"
                  placeholder="correo"
                  onChange={(e) => setData({ ...data, email: (e.target as HTMLInputElement).value })}
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-[#2F93D1] focus:border-[#2F93D1] focus:z-10 sm:text-sm mt-1"
                    placeholder="contraseña"
                    onChange={(e) => setData({ ...data, password: (e.target as HTMLInputElement).value })}
                  />
                  <button
                    type="button"
                    className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

              </div>
              {error.length > 0 && (
                <p className="text-red-500 text-[12px] text-center">{error}</p>
              )}
              {lockoutTime > 0 && (
                <Alert variant="destructive" className="mt-4 dark:bg-slate-950">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    <p>
                      Cuenta bloqueada temporalmente. Inténtalo de nuevo en: <span className="font-bold">{formatTime(lockoutTime)}</span>
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex items-end justify-end">
                <div className="text-sm">
                  <a href="/password-recovery" className="font-medium text-[#2F93D1] hover:text-[#007ACC] dark:text-[#2F93D1] dark:hover:text-[#007ACC]">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
              <div className="flex justify-center w-full">
                <ReCAPTCHA
                  sitekey="6Lc_k2MqAAAAAB19xvWE6_otNt4WRJBDfJpeo-EC"
                  onChange={handleCaptchaChange} // Se llama cuando el usuario completa el CAPTCHA
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#2F93D1] hover:bg-[#007ACC] focus:ring-[#2F93D1] text-white dark:bg-[#007ACC] dark:hover:bg-[#2F93D1] dark:focus:ring-[#2F93D1]"
                disabled={lockoutTime > 0||isLoading}
              >
                {
                  isLoading?(
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ):(
                    <p >Iniciar sesión</p>
                  )
                }
                
              </Button>
            </form>

            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <a href="/sign-up" className="font-medium text-[#2F93D1] hover:text-[#007ACC] dark:text-[#2F93D1] dark:hover:text-[#007ACC]">
                Regístrate
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
