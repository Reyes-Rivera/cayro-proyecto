import { resendCodeApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContextType";
import { UserLogin } from "@/types/User";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import ReCAPTCHA from "react-google-recaptcha";
import { Check, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";

export default function LoginPage() {
  const { login, error, errorTimer } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [data, setData] = useState<UserLogin>({ email: "", password: "" });
  const [lockoutTime, setLockoutTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

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
    <div className="flex min-h-screen items-center justify-center  p-5">
      <div className="flex flex-col-reverse md:flex-row max-w-6xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Columna Izquierda */}
        <div className="hidden md:flex md:flex-col lg:justify-center bg-blue-600 dark:bg-gray-900 text-white w-full lg:w-1/2 p-10">
          <h2 className="text-4xl font-extrabold mb-4">
            Bienvenido a <span className="text-blue-100">Cayro Uniformes</span>
          </h2>
          <p className="text-lg mb-8">
            Accede a tu cuenta para gestionar tus pedidos, ver tu historial de compras y mucho más.
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

        {/* Columna Derecha */}
        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 lg:p-10  ">
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
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="correo"
                className="w-full mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
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
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  placeholder="contraseña"
                  className="w-full mt-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-6 text-end text-sm text-gray-600 dark:text-gray-400">
                <NavLink
                  to="/password-recovery"
                  className="text-[#2F93D1] hover:text-blue-800 dark:text-blue-400"
                >
                  ¿He olvidado mi contraseña?
                </NavLink>
              </p>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            {lockoutTime > 0 && (
              <div className="bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 p-3 rounded-md text-sm">
                Cuenta bloqueada temporalmente. Inténtalo en{" "}
                <span className="font-bold">{formatTime(lockoutTime)}</span>.
              </div>
            )}

            <ReCAPTCHA
              sitekey="6Lc_k2MqAAAAAB19xvWE6_otNt4WRJBDfJpeo-EC"
              onChange={handleCaptchaChange}
              className="my-4"
            />

            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 font-bold text-white  rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg hover:scale-105 transform w-full"
              disabled={lockoutTime > 0 || isLoading}
            >
              {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Iniciar sesión"}
            </Button>
          </form>



          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <NavLink
              to="/sign-up"
              className="text-[#2F93D1] hover:text-blue-800 dark:text-blue-400"
            >
              Regístrate
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
