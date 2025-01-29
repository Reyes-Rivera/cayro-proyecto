import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import img from "./assets/rb_24655.png";
import { useForm } from "react-hook-form";

export function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      noSequential: !containsSequentialPatterns(newPassword),
    };
    setPasswordChecks(checks);
    setPasswordStrength(Object.values(checks).filter(Boolean).length * 20);
  }, [newPassword]);

  const containsSequentialPatterns = (password: string): boolean => {
    const commonPatterns = [
      "1234",
      "abcd",
      "qwerty",
      "password",
      "1111",
      "aaaa",
    ];
    const sequentialPatternRegex =
      /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef)/;
    return (
      commonPatterns.some((pattern) => password.includes(pattern)) ||
      sequentialPatternRegex.test(password)
    );
  };

  const getStrengthColor = (strength: any) => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-lime-500";
    return "bg-green-500";
  };

  const getStrengthName = (strength: any) => {
    if (strength <= 20) return "Muy débil";
    if (strength <= 40) return "Débil";
    if (strength <= 60) return "Moderada";
    if (strength <= 80) return "Fuerte";
    return "Muy fuerte";
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La nueva contraseña no cumple con todos los requisitos de seguridad.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    }

    try {
      // Aquí realiza la solicitud al backend para actualizar la contraseña
      // Ejemplo:
      // await updatePassword({ currentPassword, newPassword });

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Tu contraseña se ha actualizado correctamente.",
        confirmButtonColor: "#2F93D1",
      });

      // Reiniciar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Hubo un error al actualizar la contraseña.",
        confirmButtonColor: "#2F93D1",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-8 ">
      {/* Imagen de contraseña */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-full lg:h-64 rounded-full overflow-hidden">
          <img
            src={img}
            alt="Imagen de cambiar contraseña"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(handlePasswordChange)}
        className="col-span-2 space-y-6 px-4 sm:px-12 lg:px-20"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center lg:text-left">
          Cambiar Contraseña
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              {...register("currentPassword", {
                required: "La contraseña actual es requerida",
              })}
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                clearErrors("currentPassword");
              }}
              placeholder="Ingresa tu contraseña actual"
              className="rounded-md bg-gray-100 focus:bg-white"
            />
            {errors.currentPassword?.message && (
              <span className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message.toString()}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <div className="relative">
              <Input
                {...register("newPassword", {
                  required: "La contraseña es requerida",
                })}
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearErrors("newPassword");
                }}
                placeholder="Ingresa una nueva contraseña"
                className="rounded-md bg-gray-100 focus:bg-white"
              />
              <button
                type="button"
                className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword?.message && (
              <span className="text-red-500 text-sm mt-1">
                {errors.newPassword.message.toString()}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <div className="relative">
              <Input
                {...register("confirmPassword", {
                  required: "La confirmación de la contraseña es requerida",
                  validate: (value) =>
                    value === newPassword || "Las contraseñas no coinciden",
                })}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearErrors("confirmPassword");
                }}
                placeholder="Confirma tu nueva contraseña"
                className="rounded-md bg-gray-100 focus:bg-white"
              />
              <button
                type="button"
                className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <span className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message.toString()}
              </span>
            )}
          </div>
        </div>

        {/* Indicadores de fortaleza de contraseña */}
        {!Object.values(passwordChecks).every(Boolean) && newPassword && (
          <>
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Fortaleza de la contraseña:
                </span>
                <span
                  className={`text-sm font-medium ${getStrengthColor(
                    passwordStrength
                  ).replace("bg-", "text-")}`}
                >
                  {getStrengthName(passwordStrength)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full ${getStrengthColor(
                    passwordStrength
                  )}`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
            </div>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-500">
              <li className={passwordChecks.length ? "text-green-500" : ""}>
                {passwordChecks.length && (
                  <Check size={16} className="inline mr-1" />
                )}
                Mínimo 8 caracteres
              </li>
              <li className={passwordChecks.uppercase ? "text-green-500" : ""}>
                {passwordChecks.uppercase && (
                  <Check size={16} className="inline mr-1" />
                )}
                Al menos una mayúscula
              </li>
              <li className={passwordChecks.lowercase ? "text-green-500" : ""}>
                {passwordChecks.lowercase && (
                  <Check size={16} className="inline mr-1" />
                )}
                Al menos una minúscula
              </li>
              <li className={passwordChecks.number ? "text-green-500" : ""}>
                {passwordChecks.number && (
                  <Check size={16} className="inline mr-1" />
                )}
                Al menos un número
              </li>
              <li className={passwordChecks.special ? "text-green-500" : ""}>
                {passwordChecks.special && (
                  <Check size={16} className="inline mr-1" />
                )}
                Al menos un carácter especial
              </li>
              <li
                className={passwordChecks.noSequential ? "text-green-500" : ""}
              >
                {passwordChecks.noSequential && (
                  <Check size={16} className="inline mr-1" />
                )}
                Sin secuencias obvias como "12345" o "abcd"
              </li>
            </ul>
          </>
        )}

        {/* Botón de guardar */}
        <div className="flex justify-center sm:justify-end">
          <Button className="px-4 py-2 bg-blue-600 font-bold text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg hover:scale-105 transform">
            Guardar Contraseña
          </Button>
        </div>
      </form>
    </div>
  );
}
