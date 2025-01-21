import { Handshake, Leaf, Users } from "lucide-react";
import imgInfo from "./assets/info.jpg";
import mission from "./assets/mission.jpg";
import vision from "./assets/vision.jpg";
import { useEffect, useState } from "react";
import { getCompanyInfoApi } from "@/api/company";
import { CompanyProfile } from "@/types/CompanyInfo";

export default function AboutPage() {
  const [info, setInfo] = useState<CompanyProfile>();
  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfoApi();
      if (res) {
        setInfo(res.data[0]);
      }
    };
    getInfo();
  }, []);
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Sección "Quiénes Somos" */}
      <section
        className="relative bg-cover bg-center text-white py-32"
        style={{
          backgroundImage: `url(${imgInfo})`,
        }}
      >
        {/* Capa de degradado */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>

        {/* Contenido */}
        <div className="relative container mx-auto px-6 lg:px-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            ¿Quiénes Somos?
          </h1>
          <p className="text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed">
            Somos una empresa líder en la fabricación y venta de uniformes
            deportivos, escolares y personalizados. Nuestro compromiso con la
            calidad y la innovación nos ha posicionado como referentes en la
            industria.
          </p>
        </div>
      </section>

      {/* Misión */}
      <section className="py-16 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 lg:px-20">
          <div className="flex justify-center">
            <img
              src={mission}
              alt="Misión"
              className="rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3"
            />
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
              Nuestra Misión
            </h2>
            <p className="text-gray-700 leading-relaxed mt-6 text-xl">
             {info?.mission}
            </p>
          </div>
        </div>
      </section>

      {/* Visión */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 lg:px-20">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
              Nuestra Visión
            </h2>
            <p className="text-gray-700 leading-relaxed mt-6 text-xl">
              {info?.vision}
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <img
              src={vision}
              alt="Visión"
              className="rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/3"
            />
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Compromiso</h3>
              <p className="text-gray-600">
                Estamos comprometidos con nuestros clientes, garantizando
                productos y servicios que superen sus expectativas.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Sostenibilidad
              </h3>
              <p className="text-gray-600">
                Incorporamos prácticas responsables para cuidar el medio
                ambiente y promover la sostenibilidad en cada etapa de
                producción.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center shadow">
                <Handshake className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Integridad</h3>
              <p className="text-gray-600">
                Actuamos con honestidad, transparencia y ética en todas nuestras
                relaciones y actividades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pie de página */}
    </div>
  );
}
