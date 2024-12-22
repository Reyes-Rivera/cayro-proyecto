import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MessageSquare, Facebook, Twitter, Instagram } from "lucide-react";

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>();

  const onSubmit = (data: ContactFormValues) => {
    console.log("Formulario enviado: ", data);
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
    {/* Encabezado */}
    <div className="container mx-auto text-center mb-12 px-4">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Contáctanos</h1>
    </div>
  
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-12 px-4">
      {/* Formulario de Contacto */}
      <div className="col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Envíanos un mensaje</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          ¿Tienes alguna pregunta o necesitas ayuda? Completa el formulario y te responderemos lo antes posible.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nombre
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Ingresa tu nombre"
                {...register("firstName", { required: "El nombre es requerido" })}
                className="mt-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Apellido
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Ingresa tu apellido"
                {...register("lastName", { required: "El apellido es requerido" })}
                className="mt-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                {...register("email", {
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresa un correo electrónico válido",
                  },
                })}
                className="mt-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ingresa tu número de contacto"
                {...register("phone", {
                  required: "El teléfono es requerido",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "El teléfono debe tener 10 dígitos",
                  },
                })}
                className="mt-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Mensaje
            </Label>
            <Textarea
              id="message"
              placeholder="Escribe tu mensaje aquí"
              {...register("message", { required: "El mensaje es requerido" })}
              className="mt-2 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            {errors.message && (
              <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
            )}
          </div>
          <div className="text-end">
            <Button className="bg-[#2F93D1] dark:bg-[#2F93D1] text-white hover:bg-blue-700 px-6 py-3 dark:text-white">Enviar Mensaje</Button>
          </div>
        </form>
      </div>
  
      {/* Información de Contacto */}
      <div className="bg-[#2F93D1] text-white shadow-lg rounded-xl p-6 sm:p-8 flex flex-col lg:w-full">
        <h2 className="text-xl font-bold">¡Siempre estamos aquí para ayudarte!</h2>
        <div className="mt-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Phone className="w-8 h-8" />
            <div>
              <p className="text-lg font-semibold">Teléfono</p>
              <p>+52 123 456 7890</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <MessageSquare className="w-8 h-8" />
            <div>
              <p className="text-lg font-semibold">WhatsApp / SMS</p>
              <p>+52 987 654 3210</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="w-8 h-8" />
            <div>
              <p className="text-lg font-semibold">Correo Electrónico</p>
              <p>contacto@miempresa.com</p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm">Síguenos en nuestras redes sociales</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-white hover:text-gray-200">
              <Facebook className="w-8 h-8" />
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <Twitter className="w-8 h-8" />
            </a>
            <a href="#" className="text-white hover:text-gray-200">
              <Instagram className="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  
  );
}
