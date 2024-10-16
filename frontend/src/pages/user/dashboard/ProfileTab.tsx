import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContextType"
import { useState } from "react"
import { Edit,X } from "lucide-react"
export default function ProfileTab() {
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth();
  return (
    <form className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Button className="bg-[#2F93D1] hover:bg-blue-400">Cambiar foto</Button>
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar perfil
          </Button>
        ) : (
          <Button type="button" onClick={() => setIsEditing(false)} variant="outline">
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        )

        }
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" defaultValue={user?.name} disabled={!isEditing}/>
        </div>
        <div>
          <Label htmlFor="lastname">Apellido</Label>
          <Input id="lastname" defaultValue={user?.surname} disabled={!isEditing}/>
        </div>
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input id="email" type="email" defaultValue={user?.email} disabled={!isEditing}/>
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" type="tel" defaultValue={user?.phone} disabled={!isEditing}/>
        </div>
      </div>
      <Button type="submit" className="bg-[#2F93D1] hover:bg-blue-400" disabled={!isEditing}>Guardar cambios</Button>
    </form>
  )
}