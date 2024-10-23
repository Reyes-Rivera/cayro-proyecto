import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, X, Check } from 'lucide-react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { getCompanyConfig, updateCompanyConfig } from '@/api/company'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface emailData {
  title: string;
  greeting: string;
  maininstruction: string;
  secondaryinstruction: string;
  expirationtime: string;
  finalMessage: string;
  signature: string;
}

export interface Configuration {
  timeTokenLogin: string;
  timeTokenEmail: string;
  attemptsLogin: number;
  emailVerificationInfo: emailData;
  emailLogin: emailData;
  emailResetPass: emailData;
  _id: string;
}

export default function Configuration() {
  const [configInfo, setConfigInfo] = useState<Configuration | null>(null);
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingLogin, setIsEditingLogin] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [isEditingUsers, setIsEditingUsers] = useState(false);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("dia");

  const [formData, setFormData] = useState<Configuration | null>(null);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Configuration,
    subField?: keyof emailData
  ) => {
    setFormData(prev => {
      if (!prev) return prev; // If formData is null, do nothing

      if (subField) {
        // Ensure prev[field] is an object before spreading
        const fieldValue = prev[field as keyof Configuration];
        if (typeof fieldValue === 'object' && fieldValue !== null) {
          return {
            ...prev,
            [field]: {
              ...fieldValue, // Safely spread the object
              [subField]: e.target.value,
            },
          };
        }
        return prev; // If fieldValue is not an object, return prev
      } else {
        return {
          ...prev,
          [field]: e.target.value,
        };
      }
    });
  };

  useEffect(() => {
    const getConfig = async () => {
      const res = await getCompanyConfig();
      setConfigInfo(res.data[0]);
      setFormData(res.data[0]); // Inicializa el formulario con los valores traídos de la API
    };
    getConfig();
  }, []);

  const handleUpdate = async () => {
    try {
      // Hacer una copia de formData y luego eliminar el campo _id
      const formDataCopy = { 
        ...formData, 
        attemptsLogin: formData?.attemptsLogin ? parseInt(formData.attemptsLogin.toString()) : undefined 
      };
      
      if (formDataCopy && formDataCopy._id) {
        delete formDataCopy._id; // Elimina el campo _id
      }
      console.log(formDataCopy)
  
      const res = await updateCompanyConfig(formDataCopy, configInfo?._id);
      console.log(formDataCopy, configInfo?._id);
  
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Actualizado.',
          text: 'Datos actualizados.',
          confirmButtonColor: '#2F93D1',
        });
        return;
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error.',
        text: 'Algo salió mal, intente de nuevo más tarde.',
        confirmButtonColor: '#2F93D1',
      });
      console.log(error);
    }
  };
  
  
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Configuración de Seguridad y Mensajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="usuarios" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
                <TabsTrigger value="configuracion">Configuración General</TabsTrigger>
                <TabsTrigger value="mensajes">Mensajes de Verificación</TabsTrigger>
              </TabsList>
              {/* Gestión de Usuarios */}
              {/* Gestión de Usuarios */}
              <TabsContent value="usuarios" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <Label className="md:w-24">Periodo:</Label>
                    <Select
                      value={periodoSeleccionado}
                      onValueChange={setPeriodoSeleccionado}
                      disabled={!isEditingUsers}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Seleccionar periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dia">Día específico</SelectItem>
                        <SelectItem value="semana">Semana actual</SelectItem>
                        <SelectItem value="mes">Mes actual</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full md:w-auto" disabled={isEditingUsers}>Buscar</Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Fecha de Bloqueo</TableHead>
                        <TableHead>Número de Bloqueos</TableHead>
                        <TableHead>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>usuario@ejemplo.com</TableCell>
                        <TableCell>2023-05-15</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                          <Button variant="destructive" size="sm" disabled={!isEditingUsers}>Bloquear</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                {!isEditingUsers ? (
                  <Button onClick={() => setIsEditingUsers(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => setIsEditingUsers(false)} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button onClick={() => handleUpdate} variant="default" size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </>
                )}
              </TabsContent>

              {/* Configuración General */}
              <TabsContent value="configuracion" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="intentos-limite">Número de intentos de acceso límite:</Label>
                  <Input
                    defaultValue={configInfo?.attemptsLogin}
                    id="intentos-limite"
                    type="number"
                    placeholder="Ej: 5"
                    disabled={!isEditingGeneral}
                    value={formData?.attemptsLogin}
                    onChange={(e) => handleInputChange(e, 'attemptsLogin')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempo-vida-token-login">Tiempo de vida de los tokens (en minutos):</Label>
                  <Input
                    id="tiempo-vida-token-login"
                    type="number"
                    placeholder="Ej: 120"
                    disabled={!isEditingGeneral}
                    value={formData?.timeTokenLogin}
                    onChange={(e) => handleInputChange(e, 'timeTokenLogin')}
                  />
                </div>

                {!isEditingGeneral ? (
                  <Button onClick={() => setIsEditingGeneral(true)} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => setIsEditingGeneral(false)} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button type='button' onClick={handleUpdate} variant="default" size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </>
                )}
              </TabsContent>

              {/* Mensajes */}
              <TabsContent value="mensajes" className="space-y-6">
                <Tabs defaultValue="verificacion-correo">
                  <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                    <TabsTrigger value="verificacion-correo">Verificación de Correo</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="recuperar-contrasena">Recuperar Contraseña</TabsTrigger>
                  </TabsList>

                  {/* Verificación de Correo */}
                  <TabsContent value="verificacion-correo" className="space-y-4">
                    <Input
                      placeholder="Título del correo"
                      value={formData?.emailVerificationInfo.title}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'title')}
                      disabled={!isEditingEmail}
                    />
                    <Input
                      placeholder="Saludo"
                      value={formData?.emailVerificationInfo.greeting}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'greeting')}
                      disabled={!isEditingEmail}
                    />
                    <Textarea
                      placeholder="Instrucción principal"
                      value={formData?.emailVerificationInfo.maininstruction}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'maininstruction')}
                      disabled={!isEditingEmail}
                    />
                    <Textarea
                      placeholder="Instrucción secundaria"
                      value={formData?.emailVerificationInfo.secondaryinstruction}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'secondaryinstruction')}
                      disabled={!isEditingEmail}
                    />
                    <Input
                      placeholder="Tiempo de expiración"
                      value={formData?.emailVerificationInfo.expirationtime}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'expirationtime')}
                      disabled={!isEditingEmail}
                    />
                    <Textarea
                      placeholder="Mensaje final"
                      value={formData?.emailVerificationInfo.finalMessage}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'finalMessage')}
                      disabled={!isEditingEmail}
                    />
                    <Input
                      placeholder="Firma"
                      value={formData?.emailVerificationInfo.signature}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'signature')}
                      disabled={!isEditingEmail}
                    />
                    {!isEditingEmail ? (
                      <Button onClick={() => setIsEditingEmail(true)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => setIsEditingEmail(false)} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button  type='button' onClick={handleUpdate} variant="default" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </TabsContent>

                  {/* Login */}
                  <TabsContent value="login" className="space-y-4">
                    <Input
                      placeholder="Título del correo"
                      value={formData?.emailLogin.title}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'title')}
                      disabled={!isEditingLogin}
                    />
                    <Input
                      placeholder="Saludo"
                      value={formData?.emailLogin.greeting}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'greeting')}
                      disabled={!isEditingLogin}
                    />
                    <Textarea
                      placeholder="Instrucción principal"
                      value={formData?.emailLogin.maininstruction}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'maininstruction')}
                      disabled={!isEditingLogin}
                    />
                    <Textarea
                      placeholder="Instrucción secundaria"
                      value={formData?.emailLogin.secondaryinstruction}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'secondaryinstruction')}
                      disabled={!isEditingLogin}
                    />
                    <Input
                      placeholder="Tiempo de expiración"
                      value={formData?.emailLogin.expirationtime}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'expirationtime')}
                      disabled={!isEditingLogin}
                    />
                    <Textarea
                      placeholder="Mensaje final"
                      value={formData?.emailLogin.finalMessage}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'finalMessage')}
                      disabled={!isEditingLogin}
                    />
                    <Input
                      placeholder="Firma"
                      value={formData?.emailLogin.signature}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'signature')}
                      disabled={!isEditingLogin}
                    />
                    {!isEditingLogin ? (
                      <Button onClick={() => setIsEditingLogin(true)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => setIsEditingLogin(false)} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button  type='button' onClick={handleUpdate} variant="default" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </TabsContent>

                  {/* Recuperar Contraseña */}
                  <TabsContent value="recuperar-contrasena" className="space-y-4">
                    <Input
                      placeholder="Título del correo"
                      value={formData?.emailResetPass.title}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'title')}
                      disabled={!isEditingPass}
                    />
                    <Input
                      placeholder="Saludo"
                      value={formData?.emailResetPass.greeting}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'greeting')}
                      disabled={!isEditingPass}
                    />
                    <Textarea
                      placeholder="Instrucción principal"
                      value={formData?.emailResetPass.maininstruction}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'maininstruction')}
                      disabled={!isEditingPass}
                    />
                    <Textarea
                      placeholder="Instrucción secundaria"
                      value={formData?.emailResetPass.secondaryinstruction}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'secondaryinstruction')}
                      disabled={!isEditingPass}
                    />
                    <Input
                      placeholder="Tiempo de expiración"
                      value={formData?.emailResetPass.expirationtime}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'expirationtime')}
                      disabled={!isEditingPass}
                    />
                    <Textarea
                      placeholder="Mensaje final"
                      value={formData?.emailResetPass.finalMessage}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'finalMessage')}
                      disabled={!isEditingPass}
                    />
                    <Input
                      placeholder="Firma"
                      value={formData?.emailResetPass.signature}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'signature')}
                      disabled={!isEditingPass}
                    />
                    {!isEditingPass ? (
                      <Button onClick={() => setIsEditingPass(true)} variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => setIsEditingPass(false)} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button  type='button' onClick={handleUpdate} variant="default" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
