import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" 
export default function ProfileTab() {
    return (
      <form className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button>Cambiar foto</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" defaultValue="Juan" />
          </div>
          <div>
            <Label htmlFor="lastname">Apellido</Label>
            <Input id="lastname" defaultValue="Pérez" />
          </div>
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" defaultValue="juan.perez@ejemplo.com" />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" type="tel" defaultValue="+34 123 456 789" />
          </div>
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    )
  }