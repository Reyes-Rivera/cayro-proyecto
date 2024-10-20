import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContextType"
import { useState } from "react"
import { Edit, X } from "lucide-react"
export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth();
  return (
    <form className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
          <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">JD</AvatarFallback>
        </Avatar>
        <div className="sm:flex flex flex-col sm:flex-row gap-3">
          <Button className="bg-[#2F93D1] hover:bg-blue-400 text-white dark:bg-blue-600 dark:hover:bg-blue-500" type="button">
            Cambiar foto
          </Button>
          {!isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <Edit className="mr-2 h-4 w-4" />
              Editar perfil
            </Button>
          ) : (
            <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre</Label>
          <Input
            id="name"
            defaultValue={user?.name}
            disabled={!isEditing}
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="lastname" className="text-gray-700 dark:text-gray-300">Apellido</Label>
          <Input
            id="lastname"
            defaultValue={user?.surname}
            disabled={!isEditing}
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            defaultValue={user?.email}
            disabled={!isEditing}
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            defaultValue={user?.phone}
            disabled={!isEditing}
            className="bg-white dark:bg-gray-800 border border-gray-500 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <Button
        type="submit"
        className={`bg-[#2F93D1] hover:bg-blue-400 text-white dark:bg-blue-600 dark:hover:bg-blue-500 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isEditing}
      >
        Guardar cambios
      </Button>
    </form>
  )
}