import { resendCodeApi } from "@/api/auth";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContextType";
import { UserLogin } from "@/types/User";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import ReCAPTCHA from "react-google-recaptcha";
import { Check, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import backgroundImage from "../web/Home/assets/hero.jpg";

export default function LoginPage() {
  const { login, error, errorTimer } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [data, setData] = useState<UserLogin>({ email: "", password: "" });
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    if (error === "Error desconocido al iniciar sesión.") {
      navigate("/500", { state: { fromError: true } });
    }
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime, error]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      Swal.fire({
        icon: "error",
        title: "Error en el envío.",
        text: "Por favor, verifica que no eres un robot.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(data.email, data.password);
      if (res) {
        if (res?.role === "USER" && res.active === false) {
          setIsLoading(true);
          await resendCodeApi({ email: res.email });
          navigate("/codigo-verificacion");
        } else {
          navigate("/codigo-verificacion-auth");
        }
      }
    } catch (error: any) {
      // Capturamos el error lanzado por la función `login`
      const errorMessage =
        error.response?.data?.message || "Error desconocido al iniciar sesión.";
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        toast: true,
        text: errorMessage,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        animation: true,
        
        
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorTimer.includes("Cuenta bloqueada temporalmente")) {
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 mt-14">
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col md:flex-row w-full">
        <div
          className="hidden h-screen justify-center items-center md:flex md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          {/* Contenido de la columna derecha */}
          <div className="relative z-10 p-10 text-white">
            <div className="text-white [&_*]:!text-white flex justify-center">
              <Breadcrumbs />
            </div>
            <h2 className="text-4xl font-extrabold mb-4">
              Bienvenido a{" "}
              <span className="text-blue-100">Cayro Uniformes</span>
            </h2>
            <p className="text-lg mb-8">
              Accede a tu cuenta para gestionar tus pedidos, ver tu historial de
              compras y mucho más.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full shadow-lg">
                  <Check size={32} className="text-white" />
                </div>
                <p className="mt-3 text-sm text-white">Pedidos rápidos</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-green-400 to-green-600 rounded-full shadow-lg">
                  <Lock size={32} className="text-white" />
                </div>
                <p className="mt-3 text-sm text-white">Seguridad garantizada</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full shadow-lg">
                  <User size={32} className="text-white" />
                </div>
                <p className="mt-3 text-sm text-white">Gestión personalizada</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 lg:p-10 bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Iniciar sesión
          </h2>
          <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Correo electrónico
              </Label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="correo@ejemplo.com"
                className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Contraseña
              </Label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="********"
                  className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-6 text-end text-sm text-gray-600 dark:text-gray-400">
                <NavLink
                  to="/recuperar-password"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  ¿He olvidado mi contraseña?
                </NavLink>
              </p>
            </div>

            {lockoutTime > 0 && (
              <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 p-3 rounded-md text-sm">
                Cuenta bloqueada temporalmente. Inténtalo en{" "}
                <span className="font-bold">{formatTime(lockoutTime)}</span>.
              </div>
            )}

            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6Lc_k2MqAAAAAB19xvWE6_otNt4WRJBDfJpeo-EC"
                onChange={handleCaptchaChange}
                className="my-4"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
              disabled={lockoutTime > 0 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            ¿No tienes una cuenta?{" "}
            <NavLink
              to="/registro"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Regístrate
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
