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
import { blockedUsersApi, getBlockedUsers, getCompanyConfig, updateCompanyConfig } from '@/api/company'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
export interface BlockedUser {
  email: string,
  count: number,
}
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
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("day");
  const [daysBlocked, setDaysBlocked] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState([]);

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
      const getBlockedUsrsRes = await getBlockedUsers(periodoSeleccionado);
      setBlockedUsers(getBlockedUsrsRes.data);
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

  const handleSearchBlockUsers = async () => {
    try {
      const res = await getBlockedUsers(periodoSeleccionado);
      setBlockedUsers(res.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error.',
        text: 'Algo salió mal, intente de nuevo más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handleBlockUser = async (email: string) => {
    try {
      const res = await blockedUsersApi({ days: daysBlocked, email });
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Bloqueadado.',
          text: `El usuario ha sido bloqueado por ${daysBlocked}`,
          confirmButtonColor: '#2F93D1',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error.',
        text: 'Algo salió mal, intente de nuevo más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };
  return (
    <div className="container mx-auto sm:p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Configuración de Seguridad y Mensajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="usuarios" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:mb-0 mb-10 md:grid-cols-3 gap-2">
                <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                <TabsTrigger value="configuracion">Configuración General</TabsTrigger>
                <TabsTrigger className='col-span-2 md:col-span-1' value="mensajes">Correos</TabsTrigger>
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

                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Seleccionar periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Hoy</SelectItem>
                        <SelectItem value="week">Semana actual</SelectItem>
                        <SelectItem value="month">Mes actual</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSearchBlockUsers} className="w-full md:w-auto">Buscar</Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {
                    blockedUsers.length < 0 ? (
                      <>
                        <div className="flex justify-center items-center h-full">
                          <p>No hay usuarios bloqueados todavia.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Usuario</TableHead>
                              <TableHead>Número de Bloqueos</TableHead>
                              <TableHead>Bloquear por dias</TableHead>
                              <TableHead>Acción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {
                              blockedUsers.map((user: BlockedUser, i) => (
                                <TableRow id={i.toString()}>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>{user.count}</TableCell>
                                  <TableCell>
                                    <Input
                                      min={1}
                                      id="days-blocked"
                                      type="number"
                                      placeholder="0"
                                      disabled={!isEditingUsers}
                                      onChange={(e) => setDaysBlocked(parseInt(e.target.value))}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Button onClick={() => handleBlockUser(user.email)} variant="destructive" size="sm" disabled={!isEditingUsers}>Bloquear</Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            }

                          </TableBody>
                        </Table>

                      </>

                    )
                  }

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

                  </>
                )}
              </TabsContent>

              {/* Configuración General */}
              <TabsContent value="configuracion" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="intentos-limite">Número de intentos de acceso límite:</Label>
                  <Input
                    defaultValue={configInfo?.attemptsLogin}
                    min={1}
                    id="intentos-limite"
                    type="number"
                    placeholder="Ej: 5"
                    disabled={!isEditingGeneral}
                    value={formData?.attemptsLogin}
                    onChange={(e) => handleInputChange(e, 'attemptsLogin')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempo-vida-token-login">Tiempo de vida de los tokens de verificación (en minutos):</Label>
                  <Input
                    id="tiempo-vida-token-login"
                    type="number"
                    min={1}
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
                  <TabsList className="grid w-full grid-cols-2 md:mb-0 mb-10 md:grid-cols-3 gap-2">
                    <TabsTrigger value="verificacion-correo">Verificación de Correo</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="recuperar-contrasena" className='col-span-2 md:col-span-1'>Recuperar Contraseña</TabsTrigger>
                  </TabsList>

                  {/* Verificación de Correo */}
                  <TabsContent value="verificacion-correo" className="space-y-4">
                    <Label htmlFor="emailVerificationTitle">Título del correo</Label>
                    <Input
                      required
                      id="emailVerificationTitle"
                      placeholder="Título del correo"
                      value={formData?.emailVerificationInfo.title}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'title')}
                      disabled={!isEditingEmail}
                    />
                    <Label htmlFor="emailVerificationGreeting">Saludo</Label>
                    <Input
                      required
                      id="emailVerificationGreeting"
                      placeholder="Saludo"
                      value={formData?.emailVerificationInfo.greeting}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'greeting')}
                      disabled={!isEditingEmail}
                    />
                    <Label htmlFor="emailVerificationMain">Instrucción principal</Label>
                    <Textarea
                      required
                      id="emailVerificationMain"
                      placeholder="Instrucción principal"
                      value={formData?.emailVerificationInfo.maininstruction}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'maininstruction')}
                      disabled={!isEditingEmail}
                    />
                    <Label htmlFor="emailVerificationSecondary">Instrucción secundaria</Label>
                    <Textarea
                      required
                      id="emailVerificationSecondary"
                      placeholder="Instrucción secundaria"
                      value={formData?.emailVerificationInfo.secondaryinstruction}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'secondaryinstruction')}
                      disabled={!isEditingEmail}
                    />
                    <Label htmlFor="emailVerificationExpiration">Tiempo de expiración</Label>
                    <Input
                      required
                      id="emailVerificationExpiration"
                      placeholder="Tiempo de expiración"
                      value={formData?.emailVerificationInfo.expirationtime}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'expirationtime')}
                      disabled={!isEditingEmail}
                    />
                    <Label htmlFor="emailVerificationFinalMessage">Mensaje final</Label>
                    <Textarea
                      required
                      id="emailVerificationFinalMessage"
                      placeholder="Mensaje final"
                      value={formData?.emailVerificationInfo.finalMessage}
                      onChange={(e) => handleInputChange(e, 'emailVerificationInfo', 'finalMessage')}
                      disabled={!isEditingEmail}
                    />
                    <Label htmlFor="emailVerificationSignature">Firma</Label>
                    <Input
                      required
                      id="emailVerificationSignature"
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
                        <Button type='button' onClick={handleUpdate} variant="default" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </TabsContent>

                  {/* Login */}
                  <TabsContent value="login" className="space-y-4">
                    <Label htmlFor="emailLoginTitle">Título del correo</Label>
                    <Input
                      required
                      id="emailLoginTitle"
                      placeholder="Título del correo"
                      value={formData?.emailLogin.title}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'title')}
                      disabled={!isEditingLogin}
                    />
                    <Label htmlFor="emailLoginGreeting">Saludo</Label>
                    <Input
                      required
                      id="emailLoginGreeting"
                      placeholder="Saludo"
                      value={formData?.emailLogin.greeting}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'greeting')}
                      disabled={!isEditingLogin}
                    />
                    <Label htmlFor="emailLoginMain">Instrucción principal</Label>
                    <Textarea
                      required
                      id="emailLoginMain"
                      placeholder="Instrucción principal"
                      value={formData?.emailLogin.maininstruction}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'maininstruction')}
                      disabled={!isEditingLogin}
                    />
                    <Label htmlFor="emailLoginSecondary">Instrucción secundaria</Label>
                    <Textarea
                      required
                      id="emailLoginSecondary"
                      placeholder="Instrucción secundaria"
                      value={formData?.emailLogin.secondaryinstruction}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'secondaryinstruction')}
                      disabled={!isEditingLogin}
                    />
                    <Label htmlFor="emailLoginExpiration">Tiempo de expiración</Label>
                    <Input
                      required
                      id="emailLoginExpiration"
                      placeholder="Tiempo de expiración"
                      value={formData?.emailLogin.expirationtime}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'expirationtime')}
                      disabled={!isEditingLogin}
                    />
                    <Label htmlFor="emailLoginFinalMessage">Mensaje final</Label>
                    <Textarea
                      required
                      id="emailLoginFinalMessage"
                      placeholder="Mensaje final"
                      value={formData?.emailLogin.finalMessage}
                      onChange={(e) => handleInputChange(e, 'emailLogin', 'finalMessage')}
                      disabled={!isEditingLogin}
                    />
                    <Label htmlFor="emailLoginSignature">Firma</Label>
                    <Input
                      required
                      id="emailLoginSignature"
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
                        <Button type='button' onClick={handleUpdate} variant="default" size="sm">
                          <Check className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                      </>
                    )}
                  </TabsContent>

                  {/* Recuperar Contraseña */}
                  <TabsContent value="recuperar-contrasena" className="space-y-4">
                    <Label htmlFor="emailResetPassTitle">Título del correo</Label>
                    <Input
                      required
                      id="emailResetPassTitle"
                      placeholder="Título del correo"
                      value={formData?.emailResetPass.title}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'title')}
                      disabled={!isEditingPass}
                    />
                    <Label htmlFor="emailResetPassGreeting">Saludo</Label>
                    <Input
                      required
                      id="emailResetPassGreeting"
                      placeholder="Saludo"
                      value={formData?.emailResetPass.greeting}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'greeting')}
                      disabled={!isEditingPass}
                    />
                    <Label htmlFor="emailResetPassMain">Instrucción principal</Label>
                    <Textarea
                      required
                      id="emailResetPassMain"
                      placeholder="Instrucción principal"
                      value={formData?.emailResetPass.maininstruction}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'maininstruction')}
                      disabled={!isEditingPass}
                    />
                    <Label htmlFor="emailResetPassSecondary">Instrucción secundaria</Label>
                    <Textarea
                      required
                      id="emailResetPassSecondary"
                      placeholder="Instrucción secundaria"
                      value={formData?.emailResetPass.secondaryinstruction}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'secondaryinstruction')}
                      disabled={!isEditingPass}
                    />
                    <Label htmlFor="emailResetPassExpiration">Tiempo de expiración</Label>
                    <Input
                      required
                      id="emailResetPassExpiration"
                      placeholder="Tiempo de expiración"
                      value={formData?.emailResetPass.expirationtime}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'expirationtime')}
                      disabled={!isEditingPass}
                    />
                    <Label htmlFor="emailResetPassFinalMessage">Mensaje final</Label>
                    <Textarea
                      required
                      id="emailResetPassFinalMessage"
                      placeholder="Mensaje final"
                      value={formData?.emailResetPass.finalMessage}
                      onChange={(e) => handleInputChange(e, 'emailResetPass', 'finalMessage')}
                      disabled={!isEditingPass}
                    />
                    <Label htmlFor="emailResetPassSignature">Firma</Label>
                    <Input
                      required
                      id="emailResetPassSignature"
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
                        <Button type='button' onClick={handleUpdate} variant="default" size="sm">
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
