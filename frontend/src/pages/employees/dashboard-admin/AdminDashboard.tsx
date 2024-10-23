import { useState } from 'react'
import { User, Menu, File, Briefcase, Settings } from 'lucide-react' // Añadir icono de empresa
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Componentes para las diferentes pestañas
import PrivacyPolicies from './PrivacyPolicies'
import UserProfile from './AdminProfile'
import ProfileCompany from './ProfileCompany' // Importar el componente de perfil de la empresa
import TemrsPage from './TermsPage'
import BoundaryPage from './Boundary'
import Configuration from './Configuration' // Importar el componente de configuración

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const [documentTab, setDocumentTab] = useState('privacy') // Submenú dentro de Documentos Legales
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderTabContent = () => {
    if (activeTab === 'policies') {
      // Renderizar las opciones del submenú de Documentos Legales
      switch (documentTab) {
        case 'privacy':
          return <PrivacyPolicies />
        case 'terms':
          return <TemrsPage />
        case 'disclaimer':
          return <BoundaryPage />
        default:
          return <PrivacyPolicies />
      }
    }
    // Renderizar las otras pestañas del dashboard
    switch (activeTab) {
      case 'profile':
        return <UserProfile />
      case 'company': // Nueva pestaña para el perfil de la empresa
        return <ProfileCompany />
      case 'settings': // Pestaña de configuración
        return <Configuration />
      default:
        return <UserProfile />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                      setIsMobileMenuOpen(false) // Cierra el menú al seleccionar una opción
                    }}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Perfil del Administrador
                  </Button>
                  <Button
                    variant={activeTab === 'company' ? 'secondary' : 'ghost'} // Nueva opción
                    className={`w-full justify-start ${activeTab === 'company' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('company')
                      setIsMobileMenuOpen(false) // Cierra el menú al seleccionar una opción
                    }}
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    Perfil de la Empresa
                  </Button>
                  <Button
                    variant={activeTab === 'policies' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'policies' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('policies')
                      setIsMobileMenuOpen(false) // Cierra el menú al seleccionar una opción
                    }}
                  >
                    <File className="mr-2 h-5 w-5" />
                    Documentos legales
                  </Button>
                  <Button
                    variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${activeTab === 'settings' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                    onClick={() => {
                      setActiveTab('settings')
                      setIsMobileMenuOpen(false) // Cierra el menú al seleccionar una opción
                    }}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Configuración
                  </Button>
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
                  Perfil del Administrador
                </Button>
                <Button
                  variant={activeTab === 'company' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'company' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('company')}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Perfil de la Empresa
                </Button>
                <Button
                  variant={activeTab === 'policies' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'policies' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('policies')}
                >
                  <File className="mr-2 h-5 w-5" />
                  Documentos legales
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === 'settings' ? 'bg-blue-500 dark:bg-blue-600 text-white' : 'text-gray-900 dark:text-gray-100'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Configuración
                </Button>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 mt-6 md:mt-0 md:ml-6">
            {activeTab === 'policies' && (
              <div className="mb-4 flex flex-wrap md:justify-start md:space-x-4">
                <Button
                  variant={documentTab === 'privacy' ? 'secondary' : 'ghost'}
                  onClick={() => setDocumentTab('privacy')}
                >
                  Políticas de Privacidad
                </Button>
                <Button
                  variant={documentTab === 'terms' ? 'secondary' : 'ghost'}
                  onClick={() => setDocumentTab('terms')}
                >
                  Términos y Condiciones
                </Button>
                <Button
                  variant={documentTab === 'disclaimer' ? 'secondary' : 'ghost'}
                  onClick={() => setDocumentTab('disclaimer')}
                >
                  Deslinde Legal
                </Button>
              </div>
            )}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">{getTabTitle(activeTab, documentTab)}</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">{getTabDescription(activeTab, documentTab)}</CardDescription>
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

function getTabTitle(tab: string, documentTab: string) {
  if (tab === 'policies') {
    switch (documentTab) {
      case 'privacy': return 'Políticas de Privacidad'
      case 'terms': return 'Términos y Condiciones'
      case 'disclaimer': return 'Deslinde Legal'
      default: return 'Documentos Legales'
    }
  }

  switch (tab) {
    case 'profile': return 'Perfil del Administrador'
    case 'company': return 'Perfil de la Empresa' // Nueva pestaña
    case 'settings': return 'Configuración del Sistema' // Nueva pestaña
    default: return 'Perfil del Administrador'
  }
}

function getTabDescription(tab: string, documentTab: string) {
  if (tab === 'policies') {
    switch (documentTab) {
      case 'privacy': return 'Revisa y actualiza las políticas de privacidad de tu sistema'
      case 'terms': return 'Administra los términos y condiciones de uso'
      case 'disclaimer': return 'Gestiona el deslinde legal de tu plataforma'
      default: return 'Gestiona los documentos legales de tu plataforma'
    }
  }

  switch (tab) {
    case 'profile': return 'Gestiona tu información personal y de acceso'
    case 'company': return 'Gestiona el perfil público de tu empresa' // Descripción del perfil de la empresa
    case 'settings': return 'Configura los ajustes del sistema' // Descripción para la configuración
    default: return 'Gestiona tu información personal y de acceso'
  }
}
