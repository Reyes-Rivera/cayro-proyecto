import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContextType"

export default function AdminProfile() {
    const {user} = useAuth();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Perfil del Administrador</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Admin" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-semibold">{user?.name} {user?.surname}</h3>
                        <p className="text-gray-500">{user?.role}</p>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                    
                    <div>
                        <h4 className="text-sm font-medium">Información de Contacto</h4>
                        <p className="text-sm text-gray-500">Teléfono: {user?.phone}</p>
                        <p className="text-sm text-gray-500">Correo: {user?.email}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
