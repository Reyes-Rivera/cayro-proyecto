import { useEffect, useState } from "react";
import { companyInfoUpdateApi, getCompanyInfoApi } from "@/api/company";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyProfile, ContactInfo, SocialLinks } from "@/types/CompanyInfo";
import { Upload, Unlock, RefreshCw, PlusCircle } from 'lucide-react';
import { useAuth } from "@/context/AuthContextType";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

export default function ProfileCompany() {
  const { user } = useAuth();
  const [companyInfo, setCompanyInfo] = useState<CompanyProfile | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUpload, setIsUpload] = useState(false);

  // Estados de edición para cada campo
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingSlogan, setEditingSlogan] = useState<boolean>(false);
  const [editingEmail, setEditingEmail] = useState<boolean>(false);
  const [editingPhone, setEditingPhone] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<boolean>(false);
  const [editingSocialLinks, setEditingSocialLinks] = useState<boolean[]>([]);

  const [updatedTitle, setUpdatedTitle] = useState<string | null>(null);
  const [updatedSlogan, setUpdatedSlogan] = useState<string | null>(null);
  const [updatedContact, setUpdatedContact] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: ''
  });
  const [updatedSocialLinks, setUpdatedSocialLinks] = useState<SocialLinks[]>([]);

  useEffect(() => {
    const getCompanyInfo = async () => {
      const res = await getCompanyInfoApi();
      setCompanyInfo(res.data[0]);
      setUpdatedTitle(res.data[0]?.title);
      setUpdatedSlogan(res.data[0]?.slogan);
      setUpdatedContact(res.data[0]?.contactInfo);
      setUpdatedSocialLinks(res.data[0]?.socialLinks);
      setEditingSocialLinks(new Array(res.data[0]?.socialLinks?.length).fill(false)); // Inicializar los estados de edición para cada red social
    };
    getCompanyInfo();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleCancelEdit = () => {
    setUpdatedTitle(companyInfo?.title || '');
    setUpdatedSlogan(companyInfo?.slogan || '');
    setUpdatedContact(companyInfo?.contactInfo || {
      email: '',
      phone: '',
      address: ''
    });
    setUpdatedSocialLinks(companyInfo?.socialLinks || []);
    setEditingTitle(false);
    setEditingSlogan(false);
    setEditingEmail(false);
    setEditingPhone(false);
    setEditingAddress(false);
    setEditingSocialLinks(new Array(companyInfo?.socialLinks?.length).fill(false));
  };

  const handleSaveImg = async () => {
    try {
      const res = await companyInfoUpdateApi({
        logoUrl: imageUrl,
      }, companyInfo?._id, user?._id);
      if (res) {
        setIsUpload(false);
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados.',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        handleCancelEdit(); // Resetea los campos y estados de edición
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'No se pudieron guardar los cambios, por favor intenta más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handleSaveTitle = async () => {
    if (!updatedTitle || updatedTitle.length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'El título debe tener al menos 3 caracteres.',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }

    try {
      const res = await companyInfoUpdateApi({
        title: updatedTitle,
      }, companyInfo?._id, user?._id);
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados.',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        setEditingTitle(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'No se pudieron guardar los cambios, por favor intenta más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handleSaveSlogan = async () => {
    if (!updatedSlogan || updatedSlogan.length < 3) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'El eslogan debe tener al menos 3 caracteres.',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }

    try {
      const res = await companyInfoUpdateApi({
        slogan: updatedSlogan,
      }, companyInfo?._id, user?._id);
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados.',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        setEditingSlogan(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'No se pudieron guardar los cambios, por favor intenta más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handleEmail = async () => {
    if (!validateEmail(updatedContact.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'Por favor ingresa un correo electrónico válido.',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }

    try {
      const res = await companyInfoUpdateApi({
        contactInfo: { email: updatedContact.email }
      }, companyInfo?._id, user?._id);
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados.',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        setEditingEmail(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'No se pudieron guardar los cambios, por favor intenta más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handlePhone = async () => {
    if (!validatePhone(updatedContact.phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'Por favor ingresa un número de teléfono válido (10 dígitos).',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }

    try {
      const res = await companyInfoUpdateApi({
        contactInfo: { phone: updatedContact.phone }
      }, companyInfo?._id, user?._id);
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados.',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        setEditingPhone(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'No se pudieron guardar los cambios, por favor intenta más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handleAddress = async () => {
    if (!updatedContact.address || updatedContact.address.length < 5) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'La dirección debe tener al menos 5 caracteres.',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }

    try {
      const res = await companyInfoUpdateApi({
        contactInfo: { address: updatedContact.address }
      }, companyInfo?._id, user?._id);
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados.',
          text: 'Los cambios se han guardado correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        setEditingAddress(false);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'No se pudieron guardar los cambios, por favor intenta más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handleSocialMedia = async (index: number) => {
    const updatedLink = updatedSocialLinks[index];

    if (!validateUrl(updatedLink.url)) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'Por favor ingresa una URL válida para la red social.',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }

    try {
      const res = await companyInfoUpdateApi({
        socialLinks: updatedSocialLinks.map((link, idx) => ({
          _id: link._id, 
          platform: idx === index ? updatedLink.platform : link.platform, 
          url: idx === index ? updatedLink.url : link.url,
        }))
      }, companyInfo?._id, user?._id);
  
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados.',
          text: 'La red social se ha guardado correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        setEditingSocialLinks((prev) => prev.map((item, idx) => (idx === index ? false : item)));
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el envio.',
        text: 'No se pudieron guardar los cambios, por favor intenta más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setIsUpload(true);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', image);
    const uploadPreset = "ml_default";
    const cloudName = "dhhv8l6ti";
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.secure_url);
        console.log('Imagen subida:', data.secure_url);
      } else {
        console.error('Error en la subida:', data.error?.message);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  useEffect(() => {
    if (image) {
      uploadImageToCloudinary();
    }
  }, [image]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs defaultValue="informacion-general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="informacion-general">Información General</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="redes-sociales">Redes Sociales</TabsTrigger>
        </TabsList>

        {/* Pestaña de Información General */}
        <TabsContent value="informacion-general">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Imagen del logo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img src={imageUrl || companyInfo?.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                </div>
                <input
                  type="file"
                  id="logo-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {!isUpload ? (
                  <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Cambiar Logo
                  </Button>
                ) : (
                  <Button onClick={handleSaveImg} type="button" variant="default">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar Logo
                  </Button>
                )}
              </div>

              {/* Nombre de la Compañía */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium">Nombre de la Compañía</Label>
                <div className="flex items-center space-x-2">
                  {editingTitle ? (
                    <input
                      required
                      pattern="[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+"
                      title="Solo se permiten letras y espacios."
                      type="text"
                      value={updatedTitle || ''}
                      onChange={(e) => setUpdatedTitle(e.target.value)}
                      className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    />
                  ) : (
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">{updatedTitle}</div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingTitle(!editingTitle)}
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
                {editingTitle && (
                  <div className="flex space-x-2 mt-2">
                    <Button variant="default" onClick={handleSaveTitle} >
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              {/* Eslogan */}
              <div>
                <Label htmlFor="slogan" className="text-sm font-medium">Eslogan</Label>
                <div className="flex items-center space-x-2">
                  {editingSlogan ? (
                    <input
                      required
                      type="text"
                      value={updatedSlogan || ''}
                      onChange={(e) => setUpdatedSlogan(e.target.value)}
                      className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    />
                  ) : (
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">{updatedSlogan}</div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingSlogan(!editingSlogan)}
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
                {editingSlogan && (
                  <div className="flex space-x-2 mt-2">
                    <Button variant="default" onClick={handleSaveSlogan}>
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Contacto */}
        <TabsContent value="contacto">
          <Card>
            <CardHeader>
              <CardTitle>Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
                <div className="flex items-center space-x-2">
                  {editingEmail ? (
                    <input
                      required
                      type="email"
                      value={updatedContact.email || ''}
                      onChange={(e) => setUpdatedContact({ ...updatedContact, email: e.target.value })}
                      className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    />
                  ) : (
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">{updatedContact.email}</div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingEmail(!editingEmail)}
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
                {editingEmail && (
                  <div className="flex space-x-2 mt-2">
                    <Button variant="default" onClick={handleEmail}>
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Teléfono</Label>
                <div className="flex items-center space-x-2">
                  {editingPhone ? (
                    <input
                      required
                      type="tel"
                      value={updatedContact.phone || ''}
                      onChange={(e) => setUpdatedContact({ ...updatedContact, phone: e.target.value })}
                      className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    />
                  ) : (
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">{updatedContact.phone}</div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingPhone(!editingPhone)}
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
                {editingPhone && (
                  <div className="flex space-x-2 mt-2">
                    <Button variant="default" onClick={handlePhone}>
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              {/* Dirección */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium">Dirección</Label>
                <div className="flex items-center space-x-2">
                  {editingAddress ? (
                    <input
                      required
                      type="text"
                      value={updatedContact.address || ''}
                      onChange={(e) => setUpdatedContact({ ...updatedContact, address: e.target.value })}
                      className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    />
                  ) : (
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">{updatedContact.address}</div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingAddress(!editingAddress)}
                  >
                    <Unlock className="h-4 w-4" />
                  </Button>
                </div>
                {editingAddress && (
                  <div className="flex space-x-2 mt-2">
                    <Button variant="default" onClick={handleAddress}>
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Redes Sociales */}
        <TabsContent value="redes-sociales">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mostrar las redes sociales existentes */}
                {updatedSocialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {editingSocialLinks[index] ? (
                      <>
                        {/* Campo editable para la plataforma */}
                        <input
                        required
                          type="text"
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...updatedSocialLinks];
                            newLinks[index].platform = e.target.value;
                            setUpdatedSocialLinks(newLinks);
                          }}
                          className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                          placeholder="Plataforma"
                        />
                        {/* Campo editable para la URL */}
                        <input
                        required
                          type="url"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...updatedSocialLinks];
                            newLinks[index].url = e.target.value;
                            setUpdatedSocialLinks(newLinks);
                          }}
                          className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                          placeholder="URL"
                        />
                      </>
                    ) : (
                      <>
                        {/* Mostrar plataforma y URL en formato de dos columnas */}
                        <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          {link.platform}
                        </div>
                        <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          {link.url}
                        </div>
                      </>
                    )}

                    {/* Botón para desbloquear/guardar/cancelar */}
                    {editingSocialLinks[index] ? (
                      <>
                        <Button
                          type="button"
                          variant="default"
                          onClick={() => handleSocialMedia(index)}
                        >
                          Guardar
                        </Button>
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newEditing = [...editingSocialLinks];
                          newEditing[index] = !newEditing[index];
                          setEditingSocialLinks(newEditing);
                        }}
                      >
                        <Unlock className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {/* Botón para agregar una nueva red social */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setUpdatedSocialLinks([...updatedSocialLinks, { platform: '', url: '' }]);
                    setEditingSocialLinks([...editingSocialLinks, true]);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Agregar Red Social
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
