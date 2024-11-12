import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import contacto from "@/assets/contacto.jpg";
import ubicacion from "@/assets/Ubicacion.jpg";
import { useEffect, useState } from "react";
import { getCompanyInfoApi } from "@/api/company";
interface Contact {
  address: string;
  email: string;
  phone: string;
}
export default function Contact() {
  const [contactInfo, setContactInfo] = useState<Contact>({
    address: "",
    phone: "",
    email: "",
  });
  console.log(contactInfo);
  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfoApi();
      setContactInfo(res.data[0].contactInfo);
    };
    getInfo();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div
        style={{ backgroundImage: `url(${contacto})` }}
        className="bg-cover bg-center flex justify-center items-center w-full h-[500px]"
      >
        <div className="mx-auto flex flex-col justify-center items-center text-center bg-black/50 w-full h-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Contáctanos</h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Inicio</Link>
            <span>/</span>
            <span>Contacto</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Formulario de Contacto */}
          <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2 dark:text-white">Contáctanos</h2>
              <h3 className="text-3xl font-bold mb-6 dark:text-gray-200">Ponte en Contacto</h3>
              <form className="space-y-4">
                <Input
                  placeholder="Tu Nombre"
                  className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
                />
                <Input
                  type="email"
                  placeholder="Correo Electrónico"
                  className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
                />
                <Input
                  placeholder="Asunto"
                  className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
                />
                <Textarea
                  placeholder="Mensaje"
                  className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
                  rows={6}
                />
                <Button type="button" className="w-full bg-gray-900 text-white hover:bg-gray-700 dark:bg-blue-500 dark:hover:bg-blue-400">
                  Enviar Ahora
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <div className="text-gray-600 dark:text-gray-300">
              En Cayro Uniformes, estamos comprometidos a brindar servicios de alta calidad. Nuestro equipo está listo para atender tus necesidades y responder a todas tus preguntas.
            </div>

            <div className="grid grid-cols-1  sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Phone className="h-6 w-6 text-gray-900 dark:text-white" />
                <h4 className="font-semibold dark:text-gray-200">Teléfono</h4>
                <p className="text-gray-600 dark:text-gray-400">{contactInfo?.phone}</p>
              </div>
              <div className="space-y-2">
                <Mail className="h-6 w-6 text-gray-900 dark:text-white" />
                <h4 className="font-semibold dark:text-gray-200">Correo Electrónico</h4>
                <p className="text-gray-600 dark:text-gray-400 break-words whitespace-normal">
                  {contactInfo?.email}ssss
                </p>
              </div>

              <div className="space-y-2">
                <MapPin className="h-6 w-6 text-gray-900 dark:text-white" />
                <h4 className="font-semibold dark:text-gray-200">Nuestra Ubicación</h4>
                <p className="text-gray-600 dark:text-gray-400">{contactInfo?.address}</p>
              </div>
            </div>

            {/* Mapa de Ubicación */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={ubicacion}
                alt="Mapa de Ubicación"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
