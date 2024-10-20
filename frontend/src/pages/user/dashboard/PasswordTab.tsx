import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordTab() {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="current-password" className="text-gray-700 dark:text-gray-300">Contraseña actual</Label>
        <Input
          id="current-password"
          type="password"
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          placeholder="Introduce tu contraseña actual"
        />
      </div>
      <div>
        <Label htmlFor="new-password" className="text-gray-700 dark:text-gray-300">Nueva contraseña</Label>
        <Input
          id="new-password"
          type="password"
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          placeholder="Introduce una nueva contraseña"
        />
      </div>
      <div>
        <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">Confirmar nueva contraseña</Label>
        <Input
          id="confirm-password"
          type="password"
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          placeholder="Confirma tu nueva contraseña"
        />
      </div>
      <Button type="submit" className="w-full bg-[#2F93D1] hover:bg-blue-400 text-white dark:bg-blue-600 dark:hover:bg-blue-500">
        Cambiar contraseña
      </Button>
    </form>

  )
}