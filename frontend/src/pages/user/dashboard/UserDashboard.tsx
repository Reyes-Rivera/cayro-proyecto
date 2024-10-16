import { useState } from 'react'
import {
  User,
  Lock,
  ShoppingBag,
  MapPin,
  CreditCard,
  Bell,
  Menu,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import ProfileTab from './ProfileTab'
import PasswordTab from './PasswordTab'
import OrdersTab from './OrdersTab'
import AddressesTab from './AddressesTab'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'password':
        return <PasswordTab />
      case 'orders':
        return <OrdersTab />
      case 'addresses':
        return <AddressesTab />
      case 'payment':
        return <PaymentTab />
      case 'preferences':
        return <PreferencesTab />
      default:
        return <ProfileTab />
    }
  }
  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className={`md:w-64 flex-shrink-0 relative`}>
          {/* ${!isMobileView&&"fixed left-0 top-16"} */}
            <div className="bg-white shadow rounded-lg overflow-hidden md:fixed md:max-w-64">
              <div className="p-4 md:hidden">
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span>Menú</span>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
              <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
                <Button
                  variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-5 w-5" />
                  Perfil
                </Button>
                <Button
                  variant={activeTab === 'password' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('password')}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Cambiar Contraseña
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('orders')}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Historial de Compras
                </Button>
                <Button
                  variant={activeTab === 'addresses' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('addresses')}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Direcciones
                </Button>
                <Button
                  variant={activeTab === 'payment' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Métodos de Pago
                </Button>
                <Button
                  variant={activeTab === 'preferences' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('preferences')}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Preferencias
                </Button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:flex-1 mt-6 md:mt-0 md:ml-6">
            <Card>
              <CardHeader>
                <CardTitle>{getTabTitle(activeTab)}</CardTitle>
                <CardDescription>{getTabDescription(activeTab)}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderTabContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTabTitle(tab: string) {
  switch (tab) {
    case 'profile': return 'Perfil de Usuario'
    case 'password': return 'Cambiar Contraseña'
    case 'orders': return 'Historial de Compras'
    case 'addresses': return 'Direcciones'
    case 'payment': return 'Métodos de Pago'
    case 'preferences': return 'Preferencias'
    default: return 'Perfil de Usuario'
  }
}

function getTabDescription(tab: string) {
  switch (tab) {
    case 'profile': return 'Actualiza tu información personal'
    case 'password': return 'Cambia tu contraseña actual'
    case 'orders': return 'Revisa tus compras anteriores'
    case 'addresses': return 'Gestiona tus direcciones de envío'
    case 'payment': return 'Administra tus métodos de pago'
    case 'preferences': return 'Configura tus preferencias de notificación'
    default: return 'Actualiza tu información personal'
  }
}



function PaymentTab() {
  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4567', expiry: '12/24' },
    { id: 2, type: 'MasterCard', last4: '8901', expiry: '06/25' },
  ]

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <Card key={method.id}>
          <CardHeader>
            <CardTitle>{method.type} terminada en {method.last4}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Expira: {method.expiry}</p>
            <div className="mt-2 space-x-2">
              <Button variant="outline">Editar</Button>
              <Button variant="outline">Eliminar</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button>Agregar nuevo método de pago</Button>
    </div>
  )
}

function PreferencesTab() {
  return (
    <form className="space-y-4">
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="email-notifications" />
        <Label htmlFor="email-notifications">Recibir notificaciones por correo electrónico</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="sms-notifications" />
        <Label htmlFor="sms-notifications">Recibir notificaciones por SMS</Label>
      </div>
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="marketing-emails" />
        <Label htmlFor="marketing-emails">Recibir correos de marketing y ofertas especiales</Label>
      </div>
      <Button type="submit">Guardar preferencias</Button>
    </form>
  )
}