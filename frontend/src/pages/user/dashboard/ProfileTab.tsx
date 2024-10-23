import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContextType";

export default function ProfileTab() {
  const { user } = useAuth();

  return (
    <form className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
          <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">JD</AvatarFallback>
        </Avatar>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre</Label>
          <Input
            id="name"
            value={user?.name}
            disabled
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="lastname" className="text-gray-700 dark:text-gray-300">Apellido</Label>
          <Input
            id="lastname"
            value={user?.surname}
            disabled
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={user?.email}
            disabled
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            value={user?.phone}
            disabled
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </form>
  );
}
