import { useState } from 'react'
import { User, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Componentes para las diferentes pestañas
import ProfileTab from './ProfileTab'
// import PasswordTab from './PasswordTab'
// import OrdersTab from './OrdersTab'
// import AddressesTab from './AddressesTab'
// import { Label } from '@/components/ui/label'
// import PaymentTab from './PaymentTab'
// import PreferencesTab from './PreferencesTab'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      // case 'password':
      //   return <PasswordTab />
      // case 'orders':
      //   return <OrdersTab />
      // case 'addresses':
      //   return <AddressesTab />
      // case 'payment':
      //   return <PaymentTab />
      // case 'preferences':
      //   return <PreferencesTab />
      default:
        return <ProfileTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col md:flex-row">
          
          {/* Sidebar para móviles con Sheet */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span>Menú</span>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4">
                <nav className="flex flex-col space-y-4">
                  <Button
                    variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'profile' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('profile')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Perfil
                  </Button>
                  {/* <Button
                    variant={activeTab === 'password' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'password' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('password')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Cambiar Contraseña
                  </Button>
                  <Button
                    variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'orders' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('orders')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Historial de Compras
                  </Button>
                  <Button
                    variant={activeTab === 'addresses' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'addresses' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('addresses')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Direcciones
                  </Button>
                  <Button
                    variant={activeTab === 'payment' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'payment' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('payment')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Métodos de Pago
                  </Button>
                  <Button
                    variant={activeTab === 'preferences' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'preferences' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('preferences')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Bell className="mr-2 h-5 w-5" />
                    Preferencias
                  </Button> */}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Sidebar fijo para escritorio */}
          <div className="hidden md:block md:w-64 flex-shrink-0 relative">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden md:fixed md:max-w-64">
              <div className="p-4">
                <Button
                  variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'profile' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-5 w-5" />
                  Perfil del usuario
                </Button>
                {/* <Button
                  variant={activeTab === 'password' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'password' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('password')}
                >
                  <Lock className="mr-2 h-5 w-5" />
                  Cambiar Contraseña
                </Button>
                <Button
                  variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'orders' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Historial de Compras
                </Button>
                <Button
                  variant={activeTab === 'addresses' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'addresses' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Direcciones
                </Button>
                <Button
                  variant={activeTab === 'payment' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'payment' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Métodos de Pago
                </Button>
                <Button
                  variant={activeTab === 'preferences' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'preferences' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Preferencias
                </Button> */}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:flex-1 mt-6 md:mt-0 md:ml-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{getTabTitle(activeTab)}</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">{getTabDescription(activeTab)}</CardDescription>
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


// function PaymentTab() {
//   const paymentMethods = [
//     { id: 1, type: 'Visa', last4: '4567', expiry: '12/24' },
//     { id: 2, type: 'MasterCard', last4: '8901', expiry: '06/25' },
//   ];

//   return (
//     <div className="space-y-4">
//       {paymentMethods.map((method) => (
//         <Card
//           key={method.id}
//           className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md dark:shadow-lg"
//         >
//           <CardHeader className="border-b border-gray-200 dark:border-gray-700">
//             <CardTitle className="text-gray-900 dark:text-white">
//               {method.type} terminada en {method.last4}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="text-gray-700 dark:text-gray-300">
//             <p>Expira: {method.expiry}</p>
//             <div className="mt-2 space-x-2">
//               <Button
//                 variant="outline"
//                 className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Editar
//               </Button>
//               <Button
//                 variant="outline"
//                 className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Eliminar
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//       <Button className="w-full bg-[#2F93D1] dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 text-white">
//         Agregar nuevo método de pago
//       </Button>
//     </div>
//   );
// }


// function PreferencesTab() {
//   return (
//     <form className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-lg">
//       <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
//         <input
//           type="checkbox"
//           id="email-notifications"
//           className="form-checkbox text-[#2F93D1] dark:text-blue-600"
//         />
//         <Label htmlFor="email-notifications" className="cursor-pointer">
//           Recibir notificaciones por correo electrónico
//         </Label>
//       </div>
//       <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
//         <input
//           type="checkbox"
//           id="sms-notifications"
//           className="form-checkbox text-[#2F93D1] dark:text-blue-600"
//         />
//         <Label htmlFor="sms-notifications" className="cursor-pointer">
//           Recibir notificaciones por SMS
//         </Label>
//       </div>
//       <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200">
//         <input
//           type="checkbox"
//           id="marketing-emails"
//           className="form-checkbox text-[#2F93D1] dark:text-blue-600"
//         />
//         <Label htmlFor="marketing-emails" className="cursor-pointer">
//           Recibir correos de marketing y ofertas especiales
//         </Label>
//       </div>
//       <Button
//         type="submit"
//         className="w-full bg-[#2F93D1] dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 text-white"
//       >
//         Guardar preferencias
//       </Button>
//     </form>
//   );
// }
