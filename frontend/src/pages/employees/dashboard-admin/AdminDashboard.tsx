import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  FileText,
  Building,
  Eye,
  ArrowLeftRight,
  Menu
} from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Mock data for legal documents with versions
const legalDocuments = [
  {
    id: 1,
    type: 'Política de privacidad',
    versions: [
      { id: 11, version: '1.2', active: true, lastUpdated: '2024-03-15', content: 'Contenido de la versión 1.2 de la Política de privacidad...' },
      { id: 12, version: '1.1', active: false, lastUpdated: '2024-01-10', content: 'Contenido de la versión 1.1 de la Política de privacidad...' },
      { id: 13, version: '1.0', active: false, lastUpdated: '2023-11-05', content: 'Contenido de la versión 1.0 de la Política de privacidad...' },
    ]
  },
  {
    id: 2,
    type: 'Términos y condiciones',
    versions: [
      { id: 21, version: '2.1', active: true, lastUpdated: '2024-02-28', content: 'Contenido de la versión 2.1 de los Términos y condiciones...' },
      { id: 22, version: '2.0', active: false, lastUpdated: '2023-12-15', content: 'Contenido de la versión 2.0 de los Términos y condiciones...' },
    ]
  },
  {
    id: 3,
    type: 'Deslinde legal',
    versions: [
      { id: 31, version: '1.0', active: true, lastUpdated: '2024-01-10', content: 'Contenido de la versión 1.0 del Deslinde legal...' },
    ]
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('legal')
  const [companyProfile, setCompanyProfile] = useState({
    name: 'Cayro Uniformes',
    slogan: 'Vistiendo profesionales desde 1990',
    address: 'Calle Principal 123, Ciudad de México',
    phone: '+52 55 1234 5678',
    email: 'info@cayrouniformes.com',
  })
  const [config, setConfig] = useState({
    logo: '/placeholder.svg?height=50&width=150&text=Cayro Logo',
    verificationEmailText: 'Gracias por registrarte en Cayro Uniformes. Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace:',
  })
  const [selectedVersions, setSelectedVersions] = useState<{ [key: number]: number }>({})
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false)
  const [comparisonData, setComparisonData] = useState<{ selected: string; active: string } | null>(null)

  const handleCompanyProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: value }))
  }

  const handleVersionActivation = (docId: number, versionId: number) => {
    // In a real application, you would update this in your backend
    console.log(`Activating version ${versionId} for document ${docId}`)
  }

  const handleVersionSelection = (docId: number, versionId: number) => {
    setSelectedVersions(prev => ({ ...prev, [docId]: versionId }))
  }

  const handleCompareVersions = (docId: number) => {
    const document = legalDocuments.find(doc => doc.id === docId)
    if (!document) return

    const selectedVersion = document.versions.find(v => v.id === selectedVersions[docId])
    const activeVersion = document.versions.find(v => v.active)

    if (selectedVersion && activeVersion) {
      setComparisonData({
        selected: selectedVersion.content,
        active: activeVersion.content
      })
      setComparisonDialogOpen(true)
    }
  }

  const Sidebar = () => (
    <nav className="space-y-2">
      <Button
        variant={activeTab === 'legal' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('legal')}
      >
        <FileText className="mr-2 h-5 w-5" />
        Documentos Legales
      </Button>
      <Button
        variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('profile')}
      >
        <Building className="mr-2 h-5 w-5" />
        Perfil de la Empresa
      </Button>
      <Button
        variant={activeTab === 'config' ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => setActiveTab('config')}
      >
        <Settings className="mr-2 h-5 w-5" />
        Configuración
      </Button>
    </nav>
  )

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navegación del panel de administración
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:block w-64 bg-white shadow-md p-4">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4">
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="legal">Documentos Legales</TabsTrigger>
                  <TabsTrigger value="profile">Perfil de la Empresa</TabsTrigger>
                  <TabsTrigger value="config">Configuración</TabsTrigger>
                </TabsList>
                <TabsContent value="legal">
                  <CardTitle className="mb-4">Gestión de Documentos Legales</CardTitle>
                  <Accordion type="single" collapsible className="w-full">
                    {legalDocuments.map((doc) => (
                      <AccordionItem key={doc.id} value={`item-${doc.id}`}>
                        <AccordionTrigger>{doc.type}</AccordionTrigger>
                        <AccordionContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Versión</TableHead>
                                  <TableHead>Última Actualización</TableHead>
                                  <TableHead>Estado</TableHead>
                                  <TableHead>Acciones</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {doc.versions.map((version) => (
                                  <TableRow key={version.id}>
                                    <TableCell>{version.version}</TableCell>
                                    <TableCell>{version.lastUpdated}</TableCell>
                                    <TableCell>
                                      <Switch
                                        checked={version.active}
                                        onCheckedChange={() => handleVersionActivation(doc.id, version.id)}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="outline" size="sm" className="mr-2 mb-2 sm:mb-0">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                          <DialogHeader>
                                            <DialogTitle>{doc.type} - Versión {version.version}</DialogTitle>
                                            <DialogDescription>
                                              Última actualización: {version.lastUpdated}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="mt-4">
                                            <pre className="whitespace-pre-wrap">{version.content}</pre>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleVersionSelection(doc.id, version.id)}
                                      >
                                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                                        Comparar
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {selectedVersions[doc.id] && (
                            <div className="mt-4">
                              <h4 className="font-semibold mb-2">Comparar versiones</h4>
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <select
                                  className="border rounded p-2"
                                  value={selectedVersions[doc.id]}
                                  onChange={(e) => handleVersionSelection(doc.id, Number(e.target.value))}
                                >
                                  {doc.versions.map((v) => (
                                    <option key={v.id} value={v.id}>
                                      Versión {v.version}
                                    </option>
                                  ))}
                                </select>
                                <Button onClick={() => handleCompareVersions(doc.id)}>
                                  Comparar con la versión activa
                                </Button>
                              </div>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button className="mt-4">Agregar Nuevo Documento</Button>
                </TabsContent>
                <TabsContent value="profile">
                  <CardTitle className="mb-4">Perfil de la Empresa</CardTitle>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Nombre de la  Empresa</Label>
                      <Input
                        id="companyName"
                        name="name"
                        value={companyProfile.name}
                        onChange={handleCompanyProfileChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slogan">Slogan</Label>
                      <Input
                        id="slogan"
                        name="slogan"
                        value={companyProfile.slogan}
                        onChange={handleCompanyProfileChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        name="address"
                        value={companyProfile.address}
                        onChange={handleCompanyProfileChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={companyProfile.phone}
                        onChange={handleCompanyProfileChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={companyProfile.email}
                        onChange={handleCompanyProfileChange}
                      />
                    </div>
                    <Button type="submit">Guardar Cambios</Button>
                  </form>
                </TabsContent>
                <TabsContent value="config">
                  <CardTitle className="mb-4">Configuración</CardTitle>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="logo">Logo de la Empresa (URL)</Label>
                      <Input
                        id="logo"
                        name="logo"
                        value={config.logo}
                        onChange={handleConfigChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="verificationEmailText">Texto del Correo de Verificación</Label>
                      <Textarea
                        id="verificationEmailText"
                        name="verificationEmailText"
                        value={config.verificationEmailText}
                        onChange={handleConfigChange}
                        rows={4}
                      />
                    </div>
                    <Button type="submit">Guardar Configuración</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Comparison Dialog */}
      <Dialog open={comparisonDialogOpen} onOpenChange={setComparisonDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comparación de Versiones</DialogTitle>
            <DialogDescription>
              Comparando la versión seleccionada con la versión activa
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Versión Seleccionada</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
                {comparisonData?.selected}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Versión Activa</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
                {comparisonData?.active}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setComparisonDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}