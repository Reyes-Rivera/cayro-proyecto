import { useState } from 'react' 
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit, History, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Interfaz para definir la estructura de las políticas
interface Politica {
  id: number;
  nombre: string;
  descripcion: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  effectiveDate: string;
  isDeleted: boolean;
  estado: 'vigente' | 'no vigente' | 'eliminado';
}

export default function PrivacyPolicies() {
  const [politicaActiva, setPoliticaActiva] = useState<Politica | null>(null);
  const [politicas, setPoliticas] = useState<Politica[]>([
    { id: 1, nombre: 'Política de Cumplimiento RGPD', descripcion: 'Asegura el cumplimiento de las regulaciones de protección de datos de la UE. Se enfoca en el manejo responsable de los datos personales y garantiza que los usuarios tienen control sobre su información personal.', version: 1.0, estado: 'no vigente', createdAt: new Date(), updatedAt: new Date(), effectiveDate: '2024-01-01', isDeleted: false },
    { id: 2, nombre: 'Política de Retención de Datos', descripcion: 'Define cuánto tiempo se almacenan los datos del usuario y cuándo se eliminan. Esta política es fundamental para cumplir con las normativas y evitar el almacenamiento innecesario de información personal.', version: 1.0, estado: 'no vigente', createdAt: new Date(), updatedAt: new Date(), effectiveDate: '2024-01-01', isDeleted: false },
    { id: 3, nombre: 'Política de Cookies', descripcion: 'Describe el uso de cookies en la plataforma. Las cookies ayudan a mejorar la experiencia del usuario y permiten personalizar la información basada en los intereses del usuario.', version: 1.0, estado: 'vigente', createdAt: new Date(), updatedAt: new Date(), effectiveDate: '2024-01-01', isDeleted: false },
  ]);
  const [nuevaPolitica, setNuevaPolitica] = useState({ nombre: '', descripcion: '', effectiveDate: '', version: 1.0 });
  const [editingPolicy, setEditingPolicy] = useState<Politica | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false); // Nuevo estado para mostrar el historial completo
  const [selectedPolicy, setSelectedPolicy] = useState<Politica | null>(null); // Controlar la política seleccionada para mostrar en el modal

  const agregarPolitica = () => {
    if (nuevaPolitica.nombre && nuevaPolitica.descripcion) {
      const nuevaVersion = editingPolicy ? editingPolicy.version + 1.0 : 1.0;
      const nuevaPoliticaRegistrada: Politica = {
        id: Date.now(),
        nombre: nuevaPolitica.nombre,
        descripcion: nuevaPolitica.descripcion,
        version: nuevaVersion,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        estado: 'vigente',
        effectiveDate: nuevaPolitica.effectiveDate || new Date().toISOString().split('T')[0], // Asignar fecha actual si no se especifica
      };

      if (editingPolicy) {
        // Marcar la política anterior como no vigente
        setPoliticas(politicas.map(p => p.id === editingPolicy.id ? { ...p, estado: 'no vigente' } : p));
      }

      setPoliticas([...politicas, nuevaPoliticaRegistrada]);
      setNuevaPolitica({ nombre: '', descripcion: '', effectiveDate: '', version: 1.0 });
      setEditingPolicy(null);
    }
  };

  const eliminarPolitica = (id: number) => {
    setPoliticas(politicas.map(politica => politica.id === id ? { ...politica, isDeleted: true, estado: 'eliminado' } : politica));

    if (politicaActiva && politicaActiva.id === id) {
      setPoliticaActiva(null);
    }
  };

  const modificarPolitica = (politica: Politica) => {
    setNuevaPolitica({ 
      nombre: politica.nombre, 
      descripcion: politica.descripcion, 
      effectiveDate: politica.effectiveDate, 
      version: politica.version 
    });
    setEditingPolicy(politica);
  };

  const openModal = (politica: Politica) => {
    setSelectedPolicy(politica);
  };

  const closeModal = () => {
    setSelectedPolicy(null);
  };

  // Lista de políticas activas (no eliminadas) y ordenarlas para que las vigentes aparezcan primero
  const politicasActivas = politicas
    .filter(p => !p.isDeleted)
    .sort((a, b) => {
      // Ordenar las políticas primero por el estado (vigente primero) y luego por la versión
      if (a.estado === 'vigente' && b.estado !== 'vigente') return -1;
      if (a.estado !== 'vigente' && b.estado === 'vigente') return 1;
      return b.version - a.version;
    });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Documentos Regulatorios</CardTitle>
          <CardDescription>Gestiona y revisa los documentos regulatorios vigentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{editingPolicy ? 'Modificar Documento Regulatorio' : 'Agregar Nuevo Documento Regulatorio'}</h3>
            <div className="space-y-2">
              <div>
                <Label htmlFor="nombre-politica">Título del Documento</Label>
                <Input
                  id="nombre-politica"
                  value={nuevaPolitica.nombre}
                  onChange={(e) => setNuevaPolitica({ ...nuevaPolitica, nombre: e.target.value })}
                  placeholder="Ingrese el título del documento regulatorio"
                />
              </div>
              <div>
                <Label htmlFor="descripcion-politica">Contenido del Documento</Label>
                <Textarea
                  id="descripcion-politica"
                  value={nuevaPolitica.descripcion}
                  onChange={(e) => setNuevaPolitica({ ...nuevaPolitica, descripcion: e.target.value })}
                  placeholder="Ingrese el contenido del documento"
                />
              </div>
              <div>
                <Label htmlFor="effectiveDate">Fecha de Vigencia</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={nuevaPolitica.effectiveDate}
                  onChange={(e) => setNuevaPolitica({ ...nuevaPolitica, effectiveDate: e.target.value })}
                />
              </div>
              <Button onClick={agregarPolitica}>
                <Plus className="mr-2 h-4 w-4" /> {editingPolicy ? 'Guardar Cambios' : 'Agregar Documento'}
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          
          {/* Sección de políticas activas */}
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {politicasActivas.map((politica) => (
              <div key={politica.id} className="mb-4 flex flex-col md:flex-row md:justify-between border p-1">
                {/* Contenedor del título y contenido */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{politica.nombre} (v{politica.version})</h4>
                  <p className="text-gray-600 mt-1 line-clamp-2">{politica.descripcion}</p>
                  {/* Estado de la política: Vigente o No Vigente */}
                  <p className={`mt-2 font-semibold ${politica.estado === 'vigente' ? 'text-green-600' : 'text-red-600'}`}>
                    {politica.estado === 'vigente' ? 'Vigente' : 'No Vigente'}
                  </p>
                </div>

                {/* Contenedor de los botones en columna */}
                <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
                  <Button variant="outline" size="sm" onClick={() => modificarPolitica(politica)}>
                    <Edit className="h-4 w-4" /> Modificar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => eliminarPolitica(politica.id)}>
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openModal(politica)}>
                    <Eye className="h-4 w-4" /> Ver completo
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>

          {/* Botón para mostrar el historial completo de todas las políticas */}
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowAllHistory(!showAllHistory)}>
              <History className="h-4 w-4 mr-2" />
              {showAllHistory ? "Ocultar Historial Completo" : "Ver Historial Completo"}
            </Button>
          </div>

          {/* Historial completo de todas las políticas */}
          {showAllHistory && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Historial Completo de Todas las Políticas</h3>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {politicas.map((version) => (
                  <div key={version.id} className="mb-4 flex flex-col md:flex-row md:justify-between">
                    {/* Contenedor del título y contenido */}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{version.nombre} - Versión {version.version}</h4>
                      <p className="text-gray-600 mt-1 line-clamp-2">{version.descripcion}</p>
                      <div className="text-sm text-gray-600">
                        Creado el: {new Date(version.createdAt).toLocaleDateString()} - Estado: {version.estado}
                      </div>
                    </div>

                    {/* Contenedor de los botones en columna */}
                    <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
                      <Button variant="ghost" size="sm" onClick={() => openModal(version)}>
                        <Eye className="h-4 w-4" /> Ver completo
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para ver el contenido completo */}
      {selectedPolicy && (
        <Dialog open={!!selectedPolicy} onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedPolicy.nombre} (v{selectedPolicy.version})</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p><strong>Fecha de vigencia:</strong> {selectedPolicy.effectiveDate}</p>
              <p className="mt-2">{selectedPolicy.descripcion}</p>
              <Button variant="ghost" onClick={closeModal} className="mt-4">Cerrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
